export default {
    rules: {
        "images-recycle": {
            create: function (context) {
                return {
                    CallExpression(node) {
                        if (node.callee.name === "captureScreen") {
                            const ancestors = context.getAncestors();
                            const hasRecycle = ancestors.some(n =>
                                n.type === "CallExpression" &&
                                n.callee.property &&
                                n.callee.property.name === "recycle"
                            );
                            if (!hasRecycle) {
                                context.report({
                                    node,
                                    message: "captureScreen() 必须配套使用 recycle()",
                                });
                            }
                        }
                    }
                };
            }
        }
    }
}