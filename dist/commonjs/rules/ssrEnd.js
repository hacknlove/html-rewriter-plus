"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrEnd = ssrEnd;
function ssrEnd(rewriter, data) {
    rewriter.onDocument({
        end(end) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield Promise.all(Object.values(data.data));
                }
                catch (error) {
                    console.error(error);
                }
                const code = "<script>window.data=" +
                    JSON.stringify(data.clientSideData) +
                    ";document.dispatchEvent(new Event('on-data-loaded'))</script>";
                end.append(code, { html: true });
            });
        },
    });
}
