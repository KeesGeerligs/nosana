export declare namespace CreateValidateTransformer {
    const transform: (equals: boolean) => (project: import("../IProject").IProject) => (modulo: import("typescript").LeftHandSideExpression) => (expression: import("typescript").CallExpression) => import("typescript").Expression | import("typescript").ArrowFunction;
}
