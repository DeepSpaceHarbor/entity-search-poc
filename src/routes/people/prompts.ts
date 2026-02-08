const personJsonTemplate = {
	jobTitles: ['string'],
	excludedJobTitles: ['string'],
	location: ['string'],
	excludedLocations: ['string'],
	seniorityLevels: ['string'],
	excludedSeniorityLevels: ['string'],
	yearsInCurrentRole: {
		min: 0,

		max: 0
	},
	yearsAtCurrentCompany: {
		min: 0,

		max: 0
	},
	universities: ['string'],
	excludedUniversities: ['string'],
	name: ['string'],
	skills: ['string'],
	excludedSkills: ['string']
};

export const personaPrompt = `
Your job is to convert the user query into JSON and apply the filters (only if available). This is a json file meant to search through a database of people.
Additional rules:
If the skills are empty, try to infer them from the job title.
The json template of the filters is: ${JSON.stringify(personJsonTemplate)}.
Don't include any fields that are not in the template.
If you don't have information for a field, leave it empty or set to 0 (for numbers).
If you see information that indicates filter for a company (like company size, industry, etc.), ignore that information.
Don't include any explanations, only respond with the JSON file.
`;

export const skills = {
	coreSkills: ['string'],
	specializedSkills: ['string'],
	technicalSkills: ['string'],
	transferableSkills: ['string'],
	toolsAndPlatforms: ['string']
};

export const enhanceSkillsPrompt = `
Your job is to parse JSON that contains a description of a person and improve the "skills" field.
You should enhance the list of skills by adding any relevant or related skills that might be missing.
Think about related tools and technologies commonly associated with the provided skills.
Think about related methodologies commonly associated with the provided skills.
Think about related frameworks commonly associated with the provided skills.
Think about skills that professionals in similar roles often possess.
Think about skills that would enhance the person's effectiveness in their role.
Always consider industry trends and best practices. Use modern skills that are relevant to the person's role.
Always use the job title and other fields in the original JSON to infer any additional skills that would be relevant for the role.
If you don't think any skills are missing, just return the original list.
The json template of the skills is: ${JSON.stringify(skills)}.
Don't include any fields that are not in the template.
If you don't have information for a field, leave it empty.
Don't include any explanations, only respond with the skills JSON file.
`;

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
