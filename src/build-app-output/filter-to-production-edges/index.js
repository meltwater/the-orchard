export function filterToProductionEdges(edges) {
    return [...edges.values()]
        .filter(edge => edge.type === 'prod');
}