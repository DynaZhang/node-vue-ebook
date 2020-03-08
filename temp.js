const category = {
  computerScience: 'Computer Science',
  socialSciences: 'Social Sciences',
  economics: 'Economics',
  education: 'Eductation',
  engineering: 'Engineering',
  environment: 'Environment',
  geography: 'Geography',
  history: 'History',
  laws: 'Laws',
  lifeSciences: 'LifeSciences',
  literature: 'Literature',
  biomedicine: 'Biomedicine',
  businessandManagement: 'Business and Management',
  earthSciences: 'Earth Sciences',
  materialsScience: 'Materials Science',
  mathematics: 'Mathematics',
  medicineAndPublicHealth: 'Medicine And Public Health',
  philosophy: 'Philosophy',
  physics: 'Physics',
  politicalScienceAndInternationalRelations: 'Political Science And International Relations',
  psychology: 'Psychology',
  statistics: 'Statistics'
};

const res = []
for (let key in category) {
  res.push(category[key])
}

console.log(res)