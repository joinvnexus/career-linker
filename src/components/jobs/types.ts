export type JobsFilterState = {
  search: string;
  location: string;
  category: string;
  jobType: string;
  experience: string;
  salaryMin: string;
};

export type JobsCategory = {
  id: string;
  name: string;
};
