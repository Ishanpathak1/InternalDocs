---
title: How to Intercept a Button Click Before a Spinner Shows
author: Ishan Pathak
pubDate: 2026-02-17
description: A JavaScript event phase deep dive — intercept user clicks before other handlers fire using capture phase, with examples from a legacy ASP.NET Web Forms FROG approval system.
codeLocation: HFNY/FROG.aspx
categories: ["HFNY"]
topic: Technical Docs For HFNY
---

# How to Intercept a Button Click Before a Spinner Shows: A JavaScript Event Phase Deep Dive

Have you ever run into a situation where you need to intercept a user's button click before another JavaScript handler fires? Maybe you need to validate something or show a modal before allowing a form submission to proceed? This is exactly the challenge I faced when working on a legacy ASP.NET Web Forms application.

## Table of Contents

- [The Problem: Racing Against the Spinner](#the-problem-racing-against-the-spinner)
- [The Solution: JavaScript Event Phases to the Rescue](#the-solution-javascript-event-phases-to-the-rescue)
- [Understanding JavaScript Event Phases](#understanding-javascript-event-phases)
- [The Implementation](#the-implementation)
- [When to Use This Technique](#when-to-use-this-technique)
- [Common Gotchas and Best Practices](#common-gotchas-and-best-practices)
- [Alternative Approaches Considered](#alternative-approaches-considered)
- [Conclusion](#conclusion)
- [Related Resources](#related-resources)

---

## The Problem: Racing Against the Spinner

I was working on a FROG (Form Request for Approval) system where supervisors could approve requests. The issue arose when a supervisor tried to approve an already-approved form. Here's what was happening:

![The Problem: Racing Against the Spinner — User clicks Approve, spinner shows, postback occurs, then re-approval modal appears too late](/attachments/problem-racing-against-spinner.png)

The problem was clear: by the time the server detected the form was already approved and tried to show a re-approval modal, the user had already seen the spinner and the postback had occurred. This created a poor user experience with unnecessary server round-trips.

---

## The Solution: JavaScript Event Phases to the Rescue

The key insight was understanding how JavaScript event handling works, specifically the difference between the **capture phase** and the **bubble phase**.

Here's the improved flow I implemented:

![The Solution: Capture-phase interception — Click captured first, check approval status, show modal, then postback only after user choice](/attachments/solution-capture-phase-interception.png)

---

## Understanding JavaScript Event Phases

Before diving into the code, let's understand the key technique. JavaScript events have three phases:

1. **Capture Phase**: Event travels from document root down to target element
2. **Target Phase**: Event reaches the target element
3. **Bubble Phase**: Event bubbles back up from target to document root

Most JavaScript frameworks, including jQuery, bind event handlers to the bubble phase by default. However, you can explicitly bind to the capture phase using native DOM methods with the `capture: true` parameter.

**The crucial point**: Capture-phase handlers ALWAYS fire before bubble-phase handlers, regardless of when they were bound.

---

## The Implementation

### 1. Client-Side JavaScript Interception

The core solution was adding a capture-phase event listener:

```javascript
document.addEventListener('click', function (e) {
    var approveBtn = jQuery('[ID$="btnApprove"]')[0];
    if (!approveBtn) return;
    
    if (e.target === approveBtn || jQuery.contains(approveBtn, e.target)) {
        if (jQuery('[ID$="hfIsAlreadyApproved"]').val() === 'true') {
            e.preventDefault();
            e.stopImmediatePropagation();
            showApprovalWarningModal();
        }
    }
}, true); // <- The 'true' parameter is crucial - it enables capture phase
```

**Key points about this code:**

- `addEventListener` with `true` as the third parameter binds to the capture phase
- `e.preventDefault()` stops the default button behavior
- `e.stopImmediatePropagation()` prevents any other handlers on the same element from firing
- The check happens client-side using a hidden field value set during page load

### 2. Server-Side Changes

The server-side code was simplified significantly:

**In Page_Load (EDIT mode):**
```csharp
// Instead of showing modal immediately, just set a flag
if (isAlreadyApproved) {
    hfIsAlreadyApproved.Value = "true";
}
```

**Removed complexity:**
- No more `showApprovalWarningModal()` calls from server-side
- No more approval checks in the main submit handler
- Cleaner separation of concerns

### 3. Semantic Improvements

I also made the code more readable by renaming the hidden field:
- `hfShowReApprovalModal` → `hfIsAlreadyApproved`

This better represents what the field actually contains: a boolean flag indicating the approval state, not a command to show a modal.

---

## When to Use This Technique

This event interception pattern is particularly useful when:

1. **Legacy Systems**: You're working with existing code that you can't easily refactor
2. **Third-Party Components**: You need to intercept events from components you don't control
3. **Performance**: You want to avoid unnecessary server round-trips
4. **User Experience**: You need immediate feedback without waiting for server validation

---

## Common Gotchas and Best Practices

### 1. Event Handler Order Matters
Remember that capture handlers fire before bubble handlers, but multiple capture handlers fire in the order they were added. Plan accordingly.

### 2. Use `stopImmediatePropagation()` When Needed
If you want to completely prevent other handlers from firing, use `stopImmediatePropagation()` instead of just `stopPropagation()`.

### 3. Feature Detection
Always check if the elements you're targeting exist before trying to interact with them:

```javascript
var approveBtn = jQuery('[ID$="btnApprove"]')[0];
if (!approveBtn) return; // Guard clause
```

### 4. Consider Event Delegation
For dynamically added elements, consider using event delegation on a parent container instead of binding to specific elements.

---

## Alternative Approaches Considered

### Option 1: Modify Submit.ascx Directly
**Pros:** Cleaner integration  
**Cons:** Affects all forms using the component, requires more extensive testing

### Option 2: Server-Side Only Solution
**Pros:** Simpler JavaScript  
**Cons:** Poor UX with unnecessary round-trips, spinner always shows

### Option 3: Disable/Enable Button Pattern
**Pros:** Straightforward  
**Cons:** Doesn't prevent the spinner, more complex state management

The capture-phase interception won out because it provided the best user experience with minimal changes to existing code.

---

## Conclusion

JavaScript event phases might seem like an obscure feature, but they're incredibly powerful for solving real-world problems like this. By understanding the capture/bubble distinction, you can intercept events at exactly the right time in their lifecycle.

This technique allowed me to:
- Eliminate unnecessary server round-trips
- Provide immediate user feedback
- Maintain compatibility with existing code
- Improve overall user experience

The next time you find yourself in a situation where you need to "get there first" before another event handler, remember the capture phase — it might just be the perfect solution.

---

## Related Resources

- [MDN: Event.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [JavaScript Event Phases Explained](https://javascript.info/bubbling-and-capturing)
- [ASP.NET Web Forms Event Handling Best Practices](https://docs.microsoft.com/en-us/aspnet/web-forms/)
