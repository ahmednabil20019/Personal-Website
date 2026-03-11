// Comprehensive API Testing Script
// Run with: node test-api.js

const BASE_URL = 'http://localhost:5174';

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error with ${method} ${endpoint}:`, error.message);
    return { status: 500, error: error.message };
  }
}

// Test Categories CRUD
async function testCategories() {
  console.log('\n🧪 Testing Categories CRUD...');
  
  // Test GET categories
  console.log('\n📖 Testing GET categories...');
  const skillCats = await apiRequest('/api/categories?type=skill');
  console.log('Skill Categories:', skillCats.data?.data?.length || 0, 'items');
  
  const projectCats = await apiRequest('/api/categories?type=project');
  console.log('Project Categories:', projectCats.data?.data?.length || 0, 'items');

  // Test POST category
  console.log('\n➕ Testing POST category...');
  const newCategory = {
    name: 'Test Category',
    type: 'skill',
    description: 'A test category',
    color: '#ff6b6b'
  };
  const createResult = await apiRequest('/api/categories', 'POST', newCategory);
  console.log('Create Category:', createResult.status === 201 ? '✅ Success' : '❌ Failed');
  
  if (createResult.data?.data?._id) {
    // Test DELETE category
    console.log('\n🗑️ Testing DELETE category...');
    const deleteResult = await apiRequest(`/api/categories?id=${createResult.data.data._id}`, 'DELETE');
    console.log('Delete Category:', deleteResult.status === 200 ? '✅ Success' : '❌ Failed');
  }
}

// Test Skills CRUD
async function testSkills() {
  console.log('\n🧪 Testing Skills CRUD...');
  
  // Test GET skills
  console.log('\n📖 Testing GET skills...');
  const skills = await apiRequest('/api/skills');
  console.log('Skills:', skills.data?.data?.length || 0, 'items');

  // Test POST skill
  console.log('\n➕ Testing POST skill...');
  const newSkill = {
    name: 'Test Skill',
    icon: 'SiTest',
    category: 'Frontend',
    level: 'Intermediate'
  };
  const createResult = await apiRequest('/api/skills', 'POST', newSkill);
  console.log('Create Skill:', createResult.status === 201 ? '✅ Success' : '❌ Failed');
  
  if (createResult.data?.data?._id) {
    const skillId = createResult.data.data._id;
    
    // Test PUT skill
    console.log('\n✏️ Testing PUT skill...');
    const updatedSkill = { ...newSkill, level: 'Advanced' };
    const updateResult = await apiRequest(`/api/skills/${skillId}`, 'PUT', updatedSkill);
    console.log('Update Skill:', updateResult.status === 200 ? '✅ Success' : '❌ Failed');

    // Test DELETE skill
    console.log('\n🗑️ Testing DELETE skill...');
    const deleteResult = await apiRequest(`/api/skills/${skillId}`, 'DELETE');
    console.log('Delete Skill:', deleteResult.status === 200 ? '✅ Success' : '❌ Failed');
  }
}

// Test Projects CRUD
async function testProjects() {
  console.log('\n🧪 Testing Projects CRUD...');
  
  // Test GET projects
  console.log('\n📖 Testing GET projects...');
  const projects = await apiRequest('/api/projects');
  console.log('Projects:', projects.data?.data?.length || 0, 'items');

  // Test POST project
  console.log('\n➕ Testing POST project...');
  const newProject = {
    title: 'Test Project',
    description: 'A test project for API testing',
    images: ['https://via.placeholder.com/400x300'],
    technologies: ['React', 'Node.js'],
    category: 'Web Application',
    liveUrl: 'https://test-project.com',
    githubUrl: 'https://github.com/test/project',
    featured: false
  };
  const createResult = await apiRequest('/api/projects', 'POST', newProject);
  console.log('Create Project:', createResult.status === 201 ? '✅ Success' : '❌ Failed');
  
  if (createResult.data?.data?._id) {
    const projectId = createResult.data.data._id;
    
    // Test PUT project
    console.log('\n✏️ Testing PUT project...');
    const updatedProject = { ...newProject, featured: true };
    const updateResult = await apiRequest(`/api/projects?id=${projectId}`, 'PUT', updatedProject);
    console.log('Update Project:', updateResult.status === 200 ? '✅ Success' : '❌ Failed');
    
    // Test DELETE project
    console.log('\n🗑️ Testing DELETE project...');
    const deleteResult = await apiRequest(`/api/projects?id=${projectId}`, 'DELETE');
    console.log('Delete Project:', deleteResult.status === 200 ? '✅ Success' : '❌ Failed');
  }
}

// Test Services CRUD
async function testServices() {
  console.log('\n🧪 Testing Services CRUD...');
  
  // Test GET services
  console.log('\n📖 Testing GET services...');
  const services = await apiRequest('/api/services');
  console.log('Services:', services.data?.data?.length || 0, 'items');

  // Test POST service
  console.log('\n➕ Testing POST service...');
  const newService = {
    title: 'Test Service',
    description: 'A test service for API testing',
    icon: 'TestIcon'
  };
  const createResult = await apiRequest('/api/services', 'POST', newService);
  console.log('Create Service:', createResult.status === 200 ? '✅ Success' : '❌ Failed');
}

// Test Certifications CRUD
async function testCertifications() {
  console.log('\n🧪 Testing Certifications CRUD...');

  // Test GET certifications
  console.log('\n📖 Testing GET certifications...');
  const certifications = await apiRequest('/api/certifications');
  console.log('Certifications:', certifications.data?.data?.length || 0, 'items');

  // Test POST certification
  console.log('\n➕ Testing POST certification...');
  const newCertification = {
    title: 'Test Certification',
    issuer: 'Test Organization',
    date: '2023-12-01',
    credentialId: 'TEST-CERT-001',
    verificationUrl: 'https://test.com/verify/TEST-CERT-001',
    image: 'https://via.placeholder.com/400x300'
  };
  const createResult = await apiRequest('/api/certifications', 'POST', newCertification);
  console.log('Create Certification:', createResult.status === 201 ? '✅ Success' : '❌ Failed');

  if (createResult.data?.data?._id) {
    const certId = createResult.data.data._id;

    // Test PUT certification
    console.log('\n✏️ Testing PUT certification...');
    const updatedCertification = { ...newCertification, issuer: 'Updated Test Organization' };
    const updateResult = await apiRequest(`/api/certifications?id=${certId}`, 'PUT', updatedCertification);
    console.log('Update Certification:', updateResult.status === 200 ? '✅ Success' : '❌ Failed');

    // Test DELETE certification
    console.log('\n🗑️ Testing DELETE certification...');
    const deleteResult = await apiRequest(`/api/certifications?id=${certId}`, 'DELETE');
    console.log('Delete Certification:', deleteResult.status === 200 ? '✅ Success' : '❌ Failed');
  }
}

// Test Journey CRUD
async function testJourney() {
  console.log('\n🧪 Testing Journey CRUD...');

  // Test GET journey
  console.log('\n📖 Testing GET journey...');
  const journey = await apiRequest('/api/journey');
  console.log('Journey Items:', journey.data?.data?.length || 0, 'items');

  // Test POST journey
  console.log('\n➕ Testing POST journey...');
  const newJourneyItem = {
    title: 'Test Developer Position',
    company: 'Test Company Inc.',
    location: 'Test City, TC',
    year: '2023',
    period: '2023 - Present',
    description: 'A test position for API testing purposes.',
    achievements: ['Implemented test features', 'Improved test coverage'],
    technologies: ['JavaScript', 'Node.js', 'MongoDB'],
    type: 'work'
  };
  const createResult = await apiRequest('/api/journey', 'POST', newJourneyItem);
  console.log('Create Journey Item:', createResult.status === 201 ? '✅ Success' : '❌ Failed');

  if (createResult.data?.data?._id) {
    const journeyId = createResult.data.data._id;

    // Test PUT journey
    console.log('\n✏️ Testing PUT journey...');
    const updatedJourneyItem = { ...newJourneyItem, title: 'Updated Test Developer Position' };
    const updateResult = await apiRequest(`/api/journey?id=${journeyId}`, 'PUT', updatedJourneyItem);
    console.log('Update Journey Item:', updateResult.status === 200 ? '✅ Success' : '❌ Failed');

    // Test DELETE journey
    console.log('\n🗑️ Testing DELETE journey...');
    const deleteResult = await apiRequest(`/api/journey?id=${journeyId}`, 'DELETE');
    console.log('Delete Journey Item:', deleteResult.status === 200 ? '✅ Success' : '❌ Failed');
  }
}

// Test Contact
async function testContact() {
  console.log('\n🧪 Testing Contact...');

  // Test GET contact
  console.log('\n📖 Testing GET contact...');
  const contact = await apiRequest('/api/contact');
  console.log('Contact Info:', contact.data?.data ? '✅ Found' : '❌ Not Found');

  // Test POST contact
  console.log('\n➕ Testing POST contact...');
  const newContact = {
    email: 'test@example.com',
    phone: '+1 (555) 999-0000',
    location: 'Test City, TC, USA',
    website: 'https://testwebsite.com',
    linkedin: 'https://linkedin.com/in/testuser',
    github: 'https://github.com/testuser',
    twitter: 'https://twitter.com/testuser',
    instagram: 'https://instagram.com/testuser'
  };
  const updateResult = await apiRequest('/api/contact', 'POST', newContact);
  console.log('Update Contact:', updateResult.status === 200 ? '✅ Success' : '❌ Failed');
}

// Test About Content
async function testAbout() {
  console.log('\n🧪 Testing About Content...');

  // Test GET about
  console.log('\n📖 Testing GET about...');
  const about = await apiRequest('/api/about');
  console.log('About Content:', about.data?.data ? '✅ Found' : '❌ Not Found');

  // Test POST about
  console.log('\n➕ Testing POST about...');
  const newAbout = {
    content: 'Updated test about content for API testing.'
  };
  const updateResult = await apiRequest('/api/about', 'POST', newAbout);
  console.log('Update About:', updateResult.status === 200 ? '✅ Success' : '❌ Failed');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Tests...');
  console.log('Base URL:', BASE_URL);
  
  try {
    await testCategories();
    await testSkills();
    await testProjects();
    await testServices();
    await testCertifications();
    await testJourney();
    await testContact();
    await testAbout();

    console.log('\n🎉 All API tests completed!');
    console.log('\n📊 Test Summary:');
    console.log('- Categories: GET, POST, DELETE tested');
    console.log('- Skills: GET, POST, PUT, DELETE tested');
    console.log('- Projects: GET, POST, PUT, DELETE tested');
    console.log('- Services: GET, POST tested');
    console.log('- Certifications: GET, POST, PUT, DELETE tested');
    console.log('- Journey: GET, POST, PUT, DELETE tested');
    console.log('- Contact: GET, POST tested');
    console.log('- About: GET, POST tested');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests automatically
runAllTests();

export { runAllTests, apiRequest };
