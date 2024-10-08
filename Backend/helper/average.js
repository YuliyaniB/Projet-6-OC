exports.average = (array) => {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, nb) => acc + nb, 0);
    return (sum / array.length).toFixed(1);
};