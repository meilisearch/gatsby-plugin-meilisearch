import React from 'react'
import { graphql } from 'gatsby'
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
} from 'react-instantsearch-dom'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

const searchClient = instantMeiliSearch('http://localhost:7700', 'masterKey')

const App = ({ data }) => (
  <div className="ais-InstantSearch">
    <h1>MeiliSearch + React InstantSearch + Gatsby</h1>

    <p>Article List: </p>
    <ul>
      {data?.allMdx?.edges?.map(({ node }, index) => (
        <li key={index}>
          <a href={node.slug}>{node.frontmatter.title}</a>
        </li>
      ))}
    </ul>
    <h2>Search in this blog’s articles </h2>
    <InstantSearch indexName="animals" searchClient={searchClient}>
      <div className="right-panel">
        <SearchBox />
        <Hits hitComponent={Hit} />
        <Pagination showLast={true} />
      </div>
    </InstantSearch>
  </div>
)

function Hit(props) {
  return (
    <div key={props.hit.id}>
      <div className="hit-title">
        <Highlight attribute="title" hit={props.hit} />
      </div>
      <img src={props.hit.image} align="left" alt={props.hit.title} />
    </div>
  )
}

export const query = graphql`
  query HomePageQuery {
    allMdx {
      edges {
        node {
          slug
          frontmatter {
            title
            cover
          }
        }
      }
    }
  }
`

export default App
