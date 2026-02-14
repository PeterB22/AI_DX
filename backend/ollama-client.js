import ollama from 'ollama';

export async function callOllama(query, features, systemRules) {
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
                content: systemRules
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
