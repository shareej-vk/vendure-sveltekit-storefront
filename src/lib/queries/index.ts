//to do
//  all the api service queries will goes here

export const GET_FEATURED_PRODUCTS = `
    query GetFeaturedProducts($take: Int!) {
      products(options: { take: $take, sort: { name: ASC } }) {
        items {
          id
          name
          slug
          description
          featuredAsset {
            preview
          }
          variants {
            id
            name
            price
            priceWithTax
            currencyCode
            sku
          }
          collections {
            id
            name
            slug
          }
          facetValues {
            id
            name
            facet {
              id
              name
            }
          }
        }
      }
    }
  `