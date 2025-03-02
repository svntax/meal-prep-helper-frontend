import OpenAI from "openai";

// Notice: OpenAi implementation not fully working due to CORS issue. Requests to the AI agent are made directly instead.

export const OPENAI_API_BASE = 'https://api.near.ai/v1';
export const NEAR_AGENT_ID = 'svntax.near/recipe-search-agent/latest';
export const SIGN_MESSAGE = 'Welcome to NEAR AI';
export const RECIPIENT = 'ai.near';
export const SIGN_IN_AUTH_KEY = "signedMessageAuth";
export const SIGN_IN_NONCE_KEY = "signInNonce";

let openai = new OpenAI({
    baseURL: OPENAI_API_BASE,
    apiKey: `Bearer ${JSON.stringify({})}`,
    dangerouslyAllowBrowser: true
});

export const createAuthToken = (authJson) => {
    const authToken = {
        "account_id": authJson.accountId,
        "signature": authJson.signature,
        "public_key": authJson.publicKey,
        "callback_url": authJson.callbackUrl,
        "nonce": authJson.nonce,
        "message": SIGN_MESSAGE,
        "recipient": RECIPIENT,
        "on_behalf_of": null
    };

    return authToken;
};

// Checks if the user has already authenticated by comparing the given auth token to the current OpenAI token
export const isUserAuthenticated = (authToken) => {
    if(openai.authToken){
        const keys = Object.keys(openai.authToken);
        return keys.every(key => {
            if (!authToken.hasOwnProperty(key)) return false;
        
            const val1 = openai.authToken[key];
            const val2 = authToken[key];

            return val1 === val2;
        });
    }
    
    return false;
};

export const clearOpenAiSession = () => {
    openai.authToken = {};
};

// TODO: unused
export const getUserAuthToken = () => {
    return openai.authToken;
};

// TODO: unused
export const createOpenAiInstance = (authToken) => {
    openai = new OpenAI({
        baseURL: OPENAI_API_BASE,
        apiKey: `Bearer ${JSON.stringify(authToken)}`,
        dangerouslyAllowBrowser: true
    });
    openai.authToken = authToken;
};

// TODO: unused
export const createThread = () => {
    return openai.beta.threads.create();
};

// TODO: unused
export const addMessage = (threadId, role, content) => {
    return openai.beta.threads.messages.create(
        threadId,
        {
            role: role,
            content: content
        }
    );
};

// TODO: unused
export const createRun = (threadId, assistantId) => {
    let run = openai.beta.threads.runs.createAndPoll(
        threadId,
        { 
          assistant_id: assistantId,
        }
    );
    return run;
};

// TODO: unused
export const createRunWithStream = (threadId, assistantId, callbacks) => {
    const run = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      }, )
        .on('textCreated', (text) => process.stdout.write('\nassistant > '))
        .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
        .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
        .on('toolCallDelta', (toolCallDelta, snapshot) => {
          if (toolCallDelta.type === 'code_interpreter') {
            if (toolCallDelta.code_interpreter.input) {
              process.stdout.write(toolCallDelta.code_interpreter.input);
            }
            if (toolCallDelta.code_interpreter.outputs) {
              process.stdout.write("\noutput >\n");
              toolCallDelta.code_interpreter.outputs.forEach(output => {
                if (output.type === "logs") {
                  process.stdout.write(`\n${output.logs}\n`);
                }
              });
            }
          }
        });
};