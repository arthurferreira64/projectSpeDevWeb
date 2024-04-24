function getStatistic() {
    return (
        fetch("http://localhost:3000/product-stats")
            // Etape 1 : Je vais chercher les données
            .then((res) => res.json())
            // Etape 2 : Je ne récupère que ce qui m'intéresse
            .then((data) => data.productCounts)
            // Etape 3 : ne récupérer que ce qui m'intéresse dans les personnes
            // et aussi changer les noms des propriétés
            .then((productCounts) => {
                console.log(productCounts)
                const productCountsHTML = productCounts.map(
                    ({name, number}) => `
                        <tr>
                            <td style="text-align: center">${name}</td>
                            <td style="text-align: center">${number}</td>
                        </tr>
                    `
                ).join("");

                document.querySelector("#stats").innerHTML = `<div class="card">
                    <table class="table-bordered" style="width: 100%">
                        <tr>
                            <th>Nom</th>
                            <th>Nombre de produits</th>
                        </tr>
                        ${productCountsHTML}
                        </table>
                    </div>
`;
                }
            )
    );
}
