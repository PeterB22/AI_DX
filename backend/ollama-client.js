import ollama from 'ollama';

export async function callOllama(query, features) {
    const systemFeatureMessages = features.map(feature => {
        return {
            role: 'system',
            content: `Feature: ${feature.name}. Overall description: ${JSON.stringify(feature)}`
        };
    });
    const answer = await ollama.chat({
        model: 'llama3.2',
        messages: [
            {
                role: 'system',
                content: `You are a technical documentation assistant.
                Use the provided feature descriptions. If something is missing, say so.`
            },
            ...systemFeatureMessages,
            {
                role: 'user',
                content: `${query}`
            },
        ],
        stream: false
    });
    return {
        text: answer.message.content
    };
};
