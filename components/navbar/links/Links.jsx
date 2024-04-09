import Link from "next/link"

const Links = () => {
let  links =[
	{
		title: "Features",
		path: "/features" 
	},
	{
		title: "Pricing",
		path: "/pricing" 
	},
	{
		title: "Docs",
		path: "/docs" 
	},
	{
		title: "Blog",
		path: "/blog" 
	},
]

	return(
		<div className="flex flex-row gap-5 text-white text-[15px]">
			{links.map((link) => (
				<Link href={link.path} key={link.title}>
					{link.title}
				</Link>
			))}
		</div>
	)
}

export default Links