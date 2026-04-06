# HFNY SQL Source Control Branch Switching Process

## Purpose

This document outlines the standard process for switching branches in the HFNY SQL repository when using Git and Redgate SQL Source Control. Following this process helps keep the local database aligned with the selected branch and prevents unintended schema changes.

## Overview

The HFNY SQL repository is managed in Git, and database objects are linked to a local database through Redgate SQL Source Control.

When a developer switches branches in the SQL repository, the local database does not automatically update to match the new branch. After switching branches in Git, the developer must immediately open SQL Source Control and run **Get Latest**.

> ⚠️ **When Redgate shows drops after a branch switch, those drops usually represent database changes that are not in your current branch.**

## Branch Switching Process

1. Make sure any current SQL work has been committed, stashed, or otherwise accounted for before switching branches.
2. Switch to the desired branch in the SQL repository using Git.
3. Immediately open Redgate SQL Source Control in SQL Server Management Studio.
4. Select **Get Latest** to synchronize the local database with the selected branch.
5. Review all pending changes before applying them.
6. Pay close attention to any drops shown by Redgate.
7. Confirm the drops are expected before proceeding.
8. Once synchronization is complete, verify that the local database matches the selected branch. After taking all changes, the developer must run the generator in HFNY-CSharp to regenerate the model based on the selected database branch before starting new work.
