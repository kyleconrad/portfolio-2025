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
// async function getCaseStudy( id ) {
// 	const variables = {
// 		id: id
// 	};

// 	const query = `
// 		query ($id: String!) {
// 			contentfulCaseStudy: caseStudy(id: $id) {
// 				title
// 				slug
// 				year
// 				detail
// 				metadataDescription
// 				metadataImage {
// 					url
// 				}
// 				hero {
// 					headline
// 					subheadRich {
// 						json
// 					}
// 				}
// 				description {
// 					url
// 					detail {
// 						json
// 					}
// 					description {
// 						json
// 					}
// 				}
// 				mediaCollection {
// 					items {
// 						... on Image {
// 							__typename
// 							image {
// 								url
// 								width
// 								height
// 								description
// 							}
// 						}
// 						... on SingleColumn {
// 							__typename
// 							caption {
// 								json
// 							}
// 							alignment
// 							imagesCollection {
// 								items {
// 									url
// 									width
// 									height
// 									description
// 								}
// 							}
// 						}
// 						... on DoubleColumn {
// 							__typename
// 							caption {
// 								json
// 							}
// 							alignment
// 							leftColumnImagesCollection {
// 								items {
// 									url
// 									width
// 									height
// 									description
// 								}
// 							}
// 							rightColumnImagesCollection {
// 								items {
// 									url
// 									width
// 									height
// 									description
// 								}
// 							}
// 						}
// 						... on Video {
// 							__typename
// 							videoWebM {
// 								url
// 							}
// 							videoOgg {
// 								url
// 							}
// 							videoMp4 {
// 								url
// 							}
// 							videoPoster {
// 								url
// 							}
// 							audioBoolean
// 							loop
// 						}
// 					}
// 				}
// 			}
// 		}
// 	`;

// 	const response = await apiCall( query, variables );
// 	const json = await response.json();

// 	return await json.data.contentfulCaseStudy;
// }



// Text options
export const navOptions = {
	renderMark: {
	},
	renderNode: {
		[BLOCKS.UL_LIST]: (node, next) => `${next(node.content)}`,
		[BLOCKS.LIST_ITEM]: (node, next) => `<li>${next(node.content)}</li>`,
		[BLOCKS.PARAGRAPH]: (node, next) => `${next(node.content)}`,
		[INLINES.HYPERLINK]: (node, next) => `<a href=${node.data.uri} target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`,
	},
	preserveWhitespace: false
}

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



// Export get functions
// export const contentfulGraphQLClient = { getHome, getNavigation, getCaseStudy };
export const contentfulGraphQLClient = { getHome, getNavigation };