"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPostwares = runPostwares;
async function runPostwares(context, inputResponse, postwares) {
    let outputResponse = new Response(inputResponse.body, inputResponse);
    for (const postwareFunction of postwares) {
        outputResponse =
            (await postwareFunction(context, outputResponse)) || outputResponse;
    }
    return outputResponse;
}
