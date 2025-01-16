export declare namespace CreateAssertTransformer {
    const transform: (props: {
        equals: boolean;
        guard: boolean;
    }) => (project: import("../IProject").IProject) => (modulo: import("typescript").LeftHandSideExpression) => (expression: import("typescript").CallExpression) => import("typescript").Expression | import("typescript").ArrowFunction;
}
