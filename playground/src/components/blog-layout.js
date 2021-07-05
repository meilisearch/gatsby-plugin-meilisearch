import React from 'react'
import { MDXProvider } from '@mdx-js/react'

const Layout = ({ children, pageContext: { frontmatter } }) => {
  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <a href="/">{'<- back to Home'}</a>
      <div style={{ textAlign: 'center' }}>
        <h2>{frontmatter.title}</h2>
        <img src={frontmatter.cover} alt="" style={{ maxWidth: 400 }} />
      </div>
      <MDXProvider>{children}</MDXProvider>
    </div>
  )
}

export default Layout
