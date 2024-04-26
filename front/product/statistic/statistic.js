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
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-6 py-4">${name}</td>
                            <td class="px-6 py-4">${number}</td>
                        </tr>
                    `
          )
          .join("");

        document.querySelector("#stats").innerHTML = `
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                          <th scope="col" class="px-6 py-3">Nom</th>
                          <th scope="col" class="px-6 py-3">Nombre de produits</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productCountsHTML}
                      </tbody>
                    </table>
`;
      })
  );
}

getStatistic();
