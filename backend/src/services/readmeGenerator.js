const README_PROMPT_PREFIX = `Generate a comprehensive, professional README.md for the following project.
Use proper Markdown formatting with headers, code blocks, badges where appropriate, and well-structured sections.

Required sections:
- Overview
- Features
- Installation
- Usage
- Contributing
- License

Make it engaging and developer-friendly.
Return ONLY raw markdown content with no explanations or code fences around the entire document.

Project description:
`;

export async function generateReadme(prompt, aiProvider) {
  const trimmedPrompt = String(prompt || '').trim();
  const result = await aiProvider.generateContent(`${README_PROMPT_PREFIX}${trimmedPrompt}`);
  const markdown = result?.text?.trim();

  if (!markdown) {
    throw new Error('AI provider returned an empty README response.');
  }

  return {
    markdown,
    usage: result?.usage,
  };
}
