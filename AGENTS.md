<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the portfolio as one scrollable home page with section IDs, because its primary navigation and visual reference use a single continuous journey.
- Persist the visitor's light/dark theme selection in browser storage, because it is a user-controlled display preference expected to survive reloads.
- Keep theme-aware identity branding, the typed role line, and the vertical profile card together in the single home route so the portfolio remains one continuous journey.
- Send contact form email through the visitor-side EmailJS client using the owner's public identifiers, and retain messages in a Cloud table with insert-only anonymous access so messages are not publicly readable.
