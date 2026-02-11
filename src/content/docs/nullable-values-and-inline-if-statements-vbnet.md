---
title: Nullable Values and Inline If Statements (VB.NET)
author: bsimmons
pubDate: 2019-03-12
description: "CHSR Wiki"
categories: ["HFNY"]
topic: VB.NET
---

After some problems with setting nullable boolean values with an inline if statement, I found that the code needs to be slightly counter-intuitive if you want to set a nullable type with an inline if.

To make the inline if work you have to cast one of the two return values to the nullable type as shown below with nullable booleans:

Dim bool1 As Boolean? = Nothing
Dim bool2 As Boolean? = Nothing

bool1 = If(True, Nothing, True)  'bool1 will be set to 'False', the default value of a Boolean
bool2 = If(True, CType(Nothing, Boolean?), True)  'bool2 will be set to 'Nothing'

According to stack overflow:
    "This cast is necessary because of how If deduces types: if the two result types mismatch, a common type is deduced which is the closest parent type, i.e. a type from which both inherit. 
    However, with Nothing, new rules come into play because as far as VB is concerned, Nothing is already a valid [nullable type] – a default-initialised one. 
    So VB doesn’t try any type coercion, it simply uses [the nullable type] as the return value."
-Source: https://stackoverflow.com/questions/13297002/setting-a-variable-to-null-value-in-inline-if-statement

A good way to think of Nothing is this:
    "Nothing is a magical beast in VB.Net. It's approximately the same as default(T) in C#."
-Source: https://stackoverflow.com/questions/14633824/nullable-type-with-inline-if-cannot-work-together