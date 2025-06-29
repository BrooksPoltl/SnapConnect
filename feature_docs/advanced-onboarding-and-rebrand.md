# Feature: Advanced User Onboarding & Rebranding for Fathom Research

## 1. Overview & Mission

This document outlines the plan to implement an advanced user onboarding flow and execute a full rebrand from "SnapConnect" to "Fathom Research." The new brand identity centers on the mission: **"Democratizing investment research for everyone."** We aim to empower retail investors with tools to analyze complex financial data, moving beyond surface-level headlines to understand the real story behind the numbers.

This involves creating a multi-step tutorial for new users, updating the user profile to track onboarding completion, and systematically updating all app assets and text to reflect the new "Fathom Research" name and mission.

## 2. Onboarding Slide Content

This is the approved marketing and informational copy for the new onboarding flow.

*   **Slide 1: Welcome to Fathom Research.**
    *   **Text:** For too long, professional-grade research has been locked away. Fathom gives you the power to break down those walls. We're democratizing investment research, giving you the tools to go deeper than headlines and make smarter, more informed decisions.
*   **Slide 2: From 100 Pages to 3 Sentences.**
    *   **Text:** Our AI reads dense SEC filings like 10-Ks and 10-Qs for you. Ask a complex question and get the core insights in seconds, not hours.
*   **Slide 3: Share Verifiable Insights.**
    *   **Text:** When you share an AI-generated insight, it automatically includes a link to the source document. Elevate your conversations with data that anyone can verify.
*   **Slide 4: Build Your Research Network.**
    *   **Text:** Create focused groups to discuss strategies or follow public conversations to see what others are uncovering. This is where the best minds connect.
*   **Slide 5: The Story Behind the Stock.**
    *   **Text:** Share your analysis and discoveries through ephemeral photo and video stories. It's not just about what you trade; it's about what you know.

## 3. Implementation Plan

### Part 1: Advanced User Onboarding

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Completion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | **Backend: Add Onboarding Flag** | Add a boolean `has_completed_onboarding` column to the `profiles` table, defaulting to `false`. | `supabase/migrations/` | --- | ☐ |
| **High** | **Types: Update User Profile** | Add `has_completed_onboarding` to the TypeScript user profile type. | `src/types/user.ts` | Backend Change | ☐ |
| **High** | **Service: Update Onboarding Status**| Create an RPC function to set the `has_completed_onboarding` flag to `true`. | `src/services/user.ts` | Backend Change | ☐ |
| **High** | **UI: Update SignUp Screen** | Add the new mission statement text to the `SignUpScreen` to be visible to new users. | `src/screens/SignUpScreen/index.tsx` | --- | ☐ |
| **High** | **Content: Finalize Onboarding Text**| Document the approved "Fathom Research" text for all 5 onboarding slides. | `feature_docs/advanced-onboarding-and-rebrand.md` | --- | ☑ |
| **High**| **Component: Onboarding Screen** | Develop the main `OnboardingScreen` modal with slide logic and navigation. | `src/screens/OnboardingScreen/` | --- | ☐ |
| **Medium**| **Component: Onboarding Slide** | Create a generic `OnboardingSlide` component to display each step's content. | `src/components/OnboardingSlide/` | `OnboardingScreen` | ☐ |
| **Medium**| **Slides: Snapshot Views** | For each step, create a non-interactive, scaled-down snapshot of the relevant app screen. | `src/screens/OnboardingScreen/slides/` | `OnboardingSlide` | ☐ |
| **High** | **Navigation: Onboarding Logic** | Present the `OnboardingScreen` modally after the first login based on the new user flag. | `src/navigation/RootNavigation.tsx` | `OnboardingScreen` | ☐ |
| **Medium**| **Profile: "View Tutorial" Button**| Add a "View Tutorial" link on the `ProfileScreen` to re-launch the onboarding flow. | `src/screens/ProfileScreen/index.tsx`| `OnboardingScreen` | ☐ |

### Part 2: Rebranding to "Fathom Research"

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Completion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | **Update Key Documents** | Change "SnapConnect" to "Fathom Research" in the main PRD and other high-level docs. | `PRODUCT_REQUIREMENTS_DOCUMENT.md` | --- | ☐ |
| **Medium**| **Update UI Text** | Replace all user-facing instances of "SnapConnect" with "Fathom Research" in components and screens. | `src/components/`, `src/screens/` | --- | ☐ |
| **Low** | **Update Code Comments** | Update internal code comments and documentation that refer to the old name. | `src/`, `supabase/` | --- | ☐ |
| **Low** | **Update Config Files** | Update `app.json`, `package.json`, and other config files that contain the app display name. | `app.json`, `package.json` | --- | ☐ | 