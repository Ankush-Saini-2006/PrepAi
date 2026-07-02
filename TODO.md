- [ ] Reproduce Gemini 404 using current model
- [ ] Confirm current @google/generative-ai SDK behavior (method surface)
- [x] Update backend/config/gemini.js to use Studio-supported model alias (default: gemini-1.5-flash-latest) and allow override
- [x] Update backend/services/geminiService.js with production-ready validation + error handling
- [ ] Restart backend and verify resume analyzer no longer fails with 404
- [ ] (Optional) Pin/upgrade @google/generative-ai if later issues appear

