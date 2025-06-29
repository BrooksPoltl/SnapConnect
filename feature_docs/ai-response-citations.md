### **Feature: AI Response Citations and UI Enhancements**

#### **Backend**

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | **Return Structured Citation Data** | Update the `query-rag-model-deno` function to extract structured metadata (`company`, `filing_date`, `source_url`, `accession_number`) from Pinecone results. De-duplicate sources using `accession_number` and include the unique list in the function's response payload. | `supabase/functions/query-rag-model-deno/index.ts` | None | `[ ]` |
| **High** | **Verify DB Schema for Sources** | Confirm the `metadata` column in the `ai_messages` table can correctly store the new array of structured `Source` objects. | `add_ai_message` Supabase RPC, relevant migrations. | Backend Task 1 | `[ ]` |
| **High** | **Update `get_user_ai_conversations`** | Modify the RPC to also return the content and metadata of the last AI message for each conversation to enable previews on the home screen. | `get_user_ai_conversations` Supabase RPC | None | `[ ]` |

#### **Frontend**

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | **Update Frontend Types** | Add a `Source` interface. Update `AIMessage`, `AIConversation`, and `QueryAIResponse` types for structured citations and last message previews. | `src/types/ai.ts` | Backend Tasks 1 & 3 | `[ ]` |
| **High** | **Update AI Service Layer** | Adjust `queryAI` and `getUserAIConversations` to process the new, richer response objects from the backend. | `src/services/ai.ts` | Frontend Task 1 | `[ ]` |
| **Medium** | **Create Collapsible Text Component** | Develop a reusable component that truncates text to ~1 paragraph, adds a "show more" button, and includes a fade-out gradient. | `src/components/CollapsibleText/index.tsx` | None | `[ ]` |
| **Medium** | **Create Source Display Components** | Build `SourceList` (expandable container) and `SourceCitation` (renders one source with a link and proper formatting). | `src/components/SourceList/`, `src/components/SourceCitation/` | Frontend Task 1 | `[ ]` |
| **High** | **Integrate UI in `AIChatScreen`** | Use `CollapsibleText` for message content and `SourceList` for citations. Update navigation to `CreateAIPostScreen` to pass sources. | `src/screens/AIChatScreen/index.tsx` | Frontend Tasks 2, 3, 4 | `[ ]` |
| **Medium** | **Integrate UI in `AIHomeScreen`** | Update `ConversationCard` to include a preview of the last message using `CollapsibleText`. Modify `AIHomeScreen` to pass the required data. | `src/screens/AIHomeScreen/index.tsx`, `src/components/ConversationCard/index.tsx` | Frontend Tasks 2, 3 | `[ ]` |
| **Medium** | **Integrate UI in `CreateAIPostScreen`** | Use `CollapsibleText` for AI response previews. Handle incoming sources from route params (use first source's URL for the post). | `src/screens/CreateAIPostScreen/index.tsx` | Frontend Task 3 | `[ ]` |

</rewritten_file> 