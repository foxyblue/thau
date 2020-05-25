import * as React from 'react'
import { Divider, Link, Text, Dot, Row } from '@zeit-ui/react'

export default React.memo(({ pages, visiblePage }: any) => {
  const [currentPage, setCurrentPage] = React.useState(visiblePage)
  React.useEffect(() => {
    if (visiblePage && visiblePage !== currentPage) {
      setCurrentPage(visiblePage)
      const id = pages.find((p: any) => p.name === visiblePage).id
      window.location.hash = `#${id}`
    }
  }, [visiblePage, currentPage, setCurrentPage, pages])

  return (
    <>
      {pages.map((page: any, idx: number) => {
        if (page === 'DIVIDER') {
          return <Divider key={`DIVIDER_${idx}`} />
        }
        
        const { name, component, id,  ...props } = page
        return (
          <Row key={name}>
            <Dot type={currentPage === page.name ? 'success' : 'default'} />
            <Text type={currentPage === page.name ? 'success' : 'default'} {...props}>
              <Link href={`#${id}`}>{name}</Link>
            </Text>
          </Row>
        )
      })}
    </>
  )
})