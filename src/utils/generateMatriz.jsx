const GenerateMatriz = (doacoes) => {
    var matriz = [];

    matriz.push(
        doacoes.map(pedido => {
            var pedido_caixas = pedido.caixas.map(caixa => {
                var caixa_etapas = caixa.etapas.map(etapa => {
                    return calculateDays(etapa.update);
                });
    
                return caixa_etapas;
            });
    
            return pedido_caixas;
        })
    );

    return matriz;
}

const calculateDays = (date) => {
    var date1 = new Date(date);
    var now = new Date();
    var diffTime = Math.abs(now - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 5) {
        return [date, 0, 0];
    } else if (diffDays <= 14) {
        return [0, date, 0];
    } else {
        return [0, 0, date];
    }
}

export default GenerateMatriz;