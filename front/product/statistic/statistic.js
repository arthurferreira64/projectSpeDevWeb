function getStatistic() {
    return (
        fetch("http://localhost:3000/product-stats")
            .then((res) => res.json())
            // Etape 2 : Je ne récupère que ce qui m'intéresse
            .then((data) => data.productCounts)

            .then((productCounts) => {

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
