const companyJsonTemplate = {
	companyNames: ['string'],
	excludedCompanyNames: ['string'],
	headcount: {
		min: 0,
		max: 0
	},
	industries: ['string'],
	excludedIndustries: ['string'],
	companyType: ['partnership', 'public', 'private', 'nonprofit', 'government', 'self-employed'],
	excludedCompanyTypes: ['string'],
	location: ['string'],
	excludedLocations: ['string'],
	companySpecialties: ['string']
};

export const companyPrompt = `
Your job is to parse a description of a person and identify relevant company search filters based on that description.
Consider factors such as industry, company size (headcount), company type, location, and specialties that would align with the person's profile.
Generate a JSON file that includes these company search filters. This is a json file meant to search through a database of companies.
The json template of the filters is: ${JSON.stringify(companyJsonTemplate)}.
Don't include any fields that are not in the template.
If you don't have information for a field, leave it empty or set to 0 (for numbers).
If you see information that indicates filter for a person (like job title, skills, etc.), ignore that information.
Important: For fields that specify list of values (such as companyType, etc.), use only the values provided in the template.
Don't include any explanations, only respond with the JSON file.
`;
