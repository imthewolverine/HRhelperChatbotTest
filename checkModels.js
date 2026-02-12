require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY found in .env.local");
  process.exit(1);
}

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      console.error("\n❌ API Error:", data.error?.message || JSON.stringify(data));
      return;
    }

    console.log("\n✅ Available models that support generateContent:\n");
    data.models
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .forEach(model => {
        console.log(`✓ ${model.name.replace('models/', '')}`);
      });
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

listModels();
