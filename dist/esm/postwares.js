"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPostwares = runPostwares;
async function runPostwares(cfContext, rewriterContext, inputResponse, postwares) {
    let outputResponse = new Response(inputResponse.body, inputResponse);
    for (const postwareFunction of postwares) {
        outputResponse =
            (await postwareFunction(cfContext, rewriterContext, outputResponse)) ||
                outputResponse;
    }
    return outputResponse;
}
