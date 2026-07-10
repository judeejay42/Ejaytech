# IMPORTANT DEVELOPMENT RULES

This project is built using clean, well-structured, and fully editable code. All agents/models modifying this codebase must adhere strictly to these rules.

## Requirements

1. **Standard Technology Stack**: Use standard, human-readable HTML, CSS, and JavaScript files.
2. **No Build/Minification Artifacts**: Do NOT generate minified, compressed, obfuscated, or pre-compiled assets.
3. **Pristine Documentation**: Every section of HTML, CSS, and JS must have clear, meaningful comments explaining its purpose.
4. **Strict File Separation**:
   - `index.html` - Homepage
   - `about.html` - Company/Info Page
   - `services.html` - Offered Services
   - `courses.html` - Course Directory
   - `css/style.css` - Custom Styles
   - `js/main.js` - Client-side Interactive Behaviors
5. **Aesthetic and Literal Names**: Use clear, semantic, and descriptive class names and IDs. Do NOT use generated hashes, random IDs, or AI-generated component names.
6. **No Vendor Lock-in**: Do NOT write code that can only be edited through AI Studio. All features must be hand-editable.
7. **Complete Editability**: Ensure all text, images, links, colors, buttons, and layouts can be easily edited later by standard text editors (VS Code, Sublime, etc.).
8. **Static Asset Directories**:
   - Store all static/dynamic images in: `assets/images/`
   - Store all custom CSS in: `css/style.css` (with responsive utilities in `css/responsive.css` if necessary)
   - Store all JavaScript in: `js/main.js`
9. **No Inline/JS-Hardcoded Markup**: Do not hardcode content inside JavaScript when it can be placed cleanly in HTML.
10. **Direct Deployment Compatible**: Ensure the project can be downloaded and deployed directly to platforms like GitHub Pages, Vercel, Netlify, or standard servers without any compilation step or server-side dependency.
11. **Relative Paths**: Use relative paths for all assets to ensure seamless local opening and static hosting compatibility.
12. **Beginner Friendly**: Make the codebase highly approachable and easy to maintain, incorporating explicit comments indicating where future content can be added or edited.
13. **Preservation**: Preserve existing files and structures when making updates. Modify only requested sections and leave the rest of the file untouched.
14. **Scannable Sections**: Keep navigation menus, footer sections, and contact information highly centralized and easy to edit.
