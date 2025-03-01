import * as contentful from "contentful";
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

const $SPACE = import.meta.env.CONTENTFUL_SPACE_ID;
const $TOKEN = import.meta.env.DEV ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN : import.meta.env.CONTENTFUL_DELIVERY_TOKEN;




export const contentfulClient = contentful.createClient({
	space: $SPACE,
	accessToken: $TOKEN,
	host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});



// Overall API call to GraphQL Contentful API
async function apiCall( query, variables ) {
	const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${$SPACE}/environments/master`;

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${$TOKEN}`,
		},
		body: JSON.stringify( { query, variables } ),
	}

	return await fetch( fetchUrl, options );
}



// Get homepage query
async function getHome() {
	const query = `
		query {
			contentfulHome: homeV2(id:"2rHGhApfpb7u03tkvV6SVJ") {
				metadataTitle
				metadataDescription
				metadataImage {
					url
				}
				headline {
					json
				}
				featuredWorkCollection {
					items {
						slug
						client
						accentColor
						previewImage {
							url
							width
							height
							description
						}
						headline {
							json
						}
						lede {
							json
						}
						platform
						role
						year
					}
				}
				additionalWorkCollection {
					items {
						slug
						client
						accentColor
						shortHeadline
					}
				}
				aboutHeadline {
					json
				}
				aboutCopy {
					json
				}
				aboutColumnSubhead1
				aboutColumnList1 {
					json
				}
				aboutColumnSubhead2
				aboutColumnList2 {
					json
				}
			}
		}
	`;

	const response = await apiCall( query );
	const json = await response.json();

	return await json.data.contentfulHome;
}



// Get navigation query
async function getNavigation() {
	const query = `
		query {
			contentfulNavigation: navigationV2(id:"5C5e8NYkMbsL9yyYmFvzdM") {
				navigationLinks {
					json
				}
				footerColophon {
					json
				}
			}
		}
	`;

	const response = await apiCall( query );
	const json = await response.json();

	return await json.data.contentfulNavigation;
}



// Get single case study
async function getCaseStudy( id ) {
	const variables = {
		id: id
	};

	const query = `
		query ($id: String!) {
			contentfulCaseStudy: caseStudyV2(id: $id) {
				slug
				client
				metadataDescription
				metadataImage {
					url
				}
				accentColor
				headline {
					json
				}
				lede {
					json
				}
				link {
					json
				}
				platform
				role
				year
				agency {
					json
				}
				collaborators {
					json
				}
				detail {
					json
				}
				contentBlocksCollection {
					items {
						... on ContentText {
							__typename
							subhead
							header
							copy {
								json
							}
						}
						... on ContentStats {
							__typename
							subhead
							stat1
							stat1Copy {
								json
							}
							stat2
							stat2Copy {
								json
							}
							stat3
							stat3Copy {
								json
							}
						}
						... on ContentQuote {
							__typename
							quote {
								json
							}
							name
							detail
						}
					}
				}
			}
		}
	`;

	const response = await apiCall( query, variables );
	const json = await response.json();

	return await json.data.contentfulCaseStudy;
}



// Text options
export const headlineOptions = {
	renderMark: {
		[MARKS.BOLD]: text => `<strong>${text}</strong>`,
		[MARKS.ITALIC]: text => `<em>${text}</em>`,
		[MARKS.UNDERLINE]: text => `<u>${text}</u>`,
		[MARKS.CODE]: text => `${text}`,
	},
	renderNode: {
		[BLOCKS.PARAGRAPH]: (node, next) => `${next(node.content)}`,
	}	
}

export const copyOptions = {
	renderMark: {
		[MARKS.BOLD]: text => `<strong>${text}</strong>`,
		[MARKS.ITALIC]: text => `<em>${text}</em>`,
		[MARKS.UNDERLINE]: text => `<u>${text}</u>`,
	},
	renderNode: {
		[BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`,
		[INLINES.HYPERLINK]: (node, next) => `<a href=${node.data.uri} target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`,
	},
	preserveWhitespace: true
}

export const listOptions = {
	renderMark: {
		[MARKS.BOLD]: text => `${text}`,
		[MARKS.ITALIC]: text => `${text}`,
		[MARKS.UNDERLINE]: text => `${text}`,
	},
	renderNode: {
		[BLOCKS.UL_LIST]: (node, next) => `${next(node.content)}`,
		[BLOCKS.LIST_ITEM]: (node, next) => `<li>${next(node.content)}</li>`,
		[BLOCKS.PARAGRAPH]: (node, next) => `${next(node.content)}`,
		[INLINES.HYPERLINK]: (node, next) => `<a href=${node.data.uri} target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`,
	},
	preserveWhitespace: false
}



// Export get functions
export const contentfulGraphQLClient = { getHome, getNavigation, getCaseStudy };