import * as React from 'react'
import { Divider, Link, Text } from '@zeit-ui/react'

export default ({ pages }: any) => (
  <>
		{pages.map((page: any, idx: number) => {
			if (page === 'DIVIDER') {
				return <Divider key={`DIVIDER_${idx}`} />
			}
			
			const { name, component, id,  ...props } = page
			return (
				<Text key={name} {...props}>
					<Link href={`#${id}`}>{name}</Link>
				</Text>
			)
		})}
	</>
)