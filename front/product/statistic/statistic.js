function getStatistic() {
  return (
    fetch("http://localhost:3000/product-stats")
      .then((res) => res.json())
      // Etape 2 : Je ne récupère que ce qui m'intéresse
      .then((data) => data.productCounts)

      .then((productCounts) => {
        const productCountsHTML = productCounts
          .map(
            ({ name, number }) => `
                        <tr>
                            <td class="text-center">${name}</td>
                            <td class="text-center">${number}</td>
                        </tr>
                    `
          )
          .join("");

        document.querySelector("#stats").innerHTML = `<div class="card">
                    <table class="table-bordered" class="w-full">
                        <tr>
                            <th>Nom</th>
                            <th>Nombre de produits</th>
                        </tr>
                        ${productCountsHTML}
                        </table>
                    </div>
`;
      })
  );
}
