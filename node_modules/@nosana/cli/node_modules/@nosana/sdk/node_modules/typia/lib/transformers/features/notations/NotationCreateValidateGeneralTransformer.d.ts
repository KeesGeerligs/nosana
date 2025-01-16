export declare namespace NotationCreateValidateGeneralTransformer {
    const transform: (rename: (str: string) => string) => (project: import("../../IProject").IProject) => (modulo: import("typescript").LeftHandSideExpression) => (expression: import("typescript").CallExpression) => import("typescript").Expression | import("typescript").ArrowFunction;
}
