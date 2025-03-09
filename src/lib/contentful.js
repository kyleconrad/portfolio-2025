import * as contentful from "contentful";
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

const $SPACE = import.meta.env.CONTENTFUL_SPACE_ID;
const $TOKEN = import.meta.env.DEV ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN : import.meta.env.CONTENTFUL_DELIVERY_TOKEN;




export const contentfulClient = contentful.createClient({
	space: $SPACE,
	accessToken: $TOKEN,
	host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
	headers: { "Accept-Encoding": "gzip" }
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
				title
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
								links {
									assets {
										block {
											sys {
												id
											}
											url
											width
											height
											description
										}
									}
								}
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
						... on ContentSingleColumnImage {
							__typename
							image {
								url
								width
								height
								description
							}
							caption {
								json
							}
						}
						... on ContentDoubleColumnImage {
							__typename
							leftImage {
								url
								width
								height
								description
							}
							rightImage {
								url
								width
								height
								description
							}
							caption {
								json
							}
						}
						... on ContentImageSlider {
							__typename
							imagesCollection {
								items {
									url
									width
									height
									description
								}
							}
							caption {
								json
							}
						}
						... on ContentVideo {
							__typename
							videoWebM {
								url
							}
							videoMp4 {
								url
							}
							videoPoster {
								url
							}
							caption {
								json
							}
							audioBoolean
							loop
							showBrowserChrome
						}
						... on ContentLottieAnimation {
							__typename
							lottieFile {
								url
							}
							width
							height
							caption {
								json
							}
							loop
							showBrowserChrome
						}
					}
				}
				relatedWorkCollection {
					items {
						slug
						client
						accentColor
						shortHeadline
					}
				}
			}
		}
	`;

	const response = await apiCall( query, variables );
	const json = await response.json();

	return await json.data.contentfulCaseStudy;
}



// Get single asset
async function getAsset( id ) {
	const variables = {
		id: id
	};

	const query = `
		query ($id: String!) {
			contentfulAsset: asset(id: $id) {
				url
				width
				height
				description
			}
		}
	`;

	const response = await apiCall( query, variables );
	const json = await response.json();

	return await json.data.contentfulAsset;
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
		[INLINES.HYPERLINK]: (node, next) => `<a href=${node.data.uri} target="_blank" rel="noopener noreferrer">${next(node.content)}</a>`,
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



// Image options
export function imageResponsive( url, width ) {
	const quality = 85;
	
	const srcsetAvif =
		url + '?fm=avif&w=800&q=' + quality + ' 800w, ' +
		url + '?fm=avif&w=1200&q=' + quality + ' 1200w, ' +
		url + '?fm=avif&w=1600&q=' + quality + ' 1600w, ' +
		url + '?fm=avif&q=' + quality + ' ' + width + 'w';
	const srcsetWebP =
		url + '?fm=webp&w=800&q=' + quality + ' 800w, ' +
		url + '?fm=webp&w=1200&q=' + quality + ' 1200w, ' +
		url + '?fm=webp&w=1600&q=' + quality + ' 1600w, ' +
		url + '?fm=webp&q=' + quality + ' ' + width + 'w';
	const srcset =
		url + '?w=800&q=' + quality + ' 800w, ' +
		url + '?w=1200&q=' + quality + ' 1200w, ' +
		url + '?w=1600&q=' + quality + ' 1600w, ' +
		url + '?q=' + quality + ' ' + width + 'w';

	const sizes =
		'(max-width: 700px) 800px, ' +
		'(max-width: 1024px) 1200px, ' + 
		'(max-width: 1600px) 1600px, ' + width + 'px';



	return {
		avif: srcsetAvif,
		webp: srcsetWebP,
		srcset: srcset,
		sizes: sizes
	}
}



// Export get functions
export const contentfulGraphQLClient = { getHome, getNavigation, getCaseStudy };