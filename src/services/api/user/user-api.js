import axios from 'axios'
import { API_BASE_URL } from '../config'

const DEPARTMENT_MAP = {
	1: 'Sales',
	2: 'Procurement',
	3: 'Operations',
	4: 'Finance',
	5: 'HR',
}

const DESIGNATION_MAP = {
	1: 'Sales Manager',
	2: 'Procurement Lead',
	3: 'Operations Executive',
	4: 'Finance Analyst',
	5: 'HR Specialist',
}

const MANAGER_MAP = {
	1: 'Rahul Mehta',
	2: 'Ananya Gupta',
	3: 'Vikram Rao',
	4: 'Priya Singh',
}

const EMPLOYMENT_TYPE_MAP = {
	1: 'Full Time',
	2: 'Contract',
	3: 'Intern',
}

const FALLBACK_USERS = [
	{
		user_id: 101,
		username: 'rahul.mehta',
		email: 'rahul.mehta@rahulpapers.com',
		employee_code: 'EMP-001',
		first_name: 'Rahul',
		middle_name: '',
		last_name: 'Mehta',
		full_name: 'Rahul Mehta',
		gender: 'Male',
		date_of_birth: '1988-06-12',
		blood_group: 'B+',
		marital_status: 'Married',
		mobile_number: '+91-9876543210',
		alternate_mobile: '+91-9811122233',
		address_line1: '501, Palm Residency',
		address_line2: 'Andheri East',
		city: 'Mumbai',
		taluka: 'Andheri',
		district: 'Mumbai',
		state: 'Maharashtra',
		country: 'India',
		pin_code: '400069',
		department_id: 1,
		designation_id: 1,
		employment_type_id: 1,
		date_of_joining: '2021-04-01',
		employment_status: 'Active',
		reporting_manager_id: 3,
		profile_photo_url: '',
		is_admin: true,
		last_login_at: '2024-12-30T09:12:00Z',
		createdAt: '2024-01-05T10:00:00Z',
		updatedAt: '2024-12-30T09:12:00Z',
	},
	{
		user_id: 102,
		username: 'ananya.g',
		email: 'ananya.gupta@rahulpapers.com',
		employee_code: 'EMP-017',
		first_name: 'Ananya',
		middle_name: 'R',
		last_name: 'Gupta',
		full_name: 'Ananya R Gupta',
		gender: 'Female',
		date_of_birth: '1992-02-24',
		blood_group: 'O+',
		marital_status: 'Single',
		mobile_number: '+91-9922334455',
		alternate_mobile: '',
		address_line1: 'Shivaji Nagar',
		address_line2: 'Sector 4',
		city: 'Pune',
		taluka: 'Haveli',
		district: 'Pune',
		state: 'Maharashtra',
		country: 'India',
		pin_code: '411005',
		department_id: 2,
		designation_id: 2,
		employment_type_id: 1,
		date_of_joining: '2022-08-16',
		employment_status: 'Active',
		reporting_manager_id: 1,
		profile_photo_url: '',
		is_admin: false,
		last_login_at: '2024-12-28T12:45:00Z',
		createdAt: '2022-08-16T06:30:00Z',
		updatedAt: '2024-12-28T12:45:00Z',
	},
	{
		user_id: 103,
		username: 'vikram.rao',
		email: 'vikram.rao@rahulpapers.com',
		employee_code: 'EMP-025',
		first_name: 'Vikram',
		middle_name: '',
		last_name: 'Rao',
		full_name: 'Vikram Rao',
		gender: 'Male',
		date_of_birth: '1985-11-03',
		blood_group: 'A+',
		marital_status: 'Married',
		mobile_number: '+91-9819081908',
		alternate_mobile: '+91-9876000000',
		address_line1: 'Lake View Residency',
		address_line2: 'Sector 7',
		city: 'Ahmedabad',
		taluka: 'Daskroi',
		district: 'Ahmedabad',
		state: 'Gujarat',
		country: 'India',
		pin_code: '380015',
		department_id: 3,
		designation_id: 3,
		employment_type_id: 2,
		date_of_joining: '2020-01-12',
		employment_status: 'On Leave',
		reporting_manager_id: 4,
		profile_photo_url: '',
		is_admin: false,
		last_login_at: '2024-12-15T07:30:00Z',
		createdAt: '2020-01-12T04:15:00Z',
		updatedAt: '2024-12-20T05:00:00Z',
	},
	{
		user_id: 104,
		username: 'priya.singh',
		email: 'priya.singh@rahulpapers.com',
		employee_code: 'EMP-031',
		first_name: 'Priya',
		middle_name: '',
		last_name: 'Singh',
		full_name: 'Priya Singh',
		gender: 'Female',
		date_of_birth: '1995-09-10',
		blood_group: 'AB+',
		marital_status: 'Single',
		mobile_number: '+91-9000090000',
		alternate_mobile: '',
		address_line1: 'Green Meadows',
		address_line2: 'Phase 2',
		city: 'Surat',
		taluka: 'Surat City',
		district: 'Surat',
		state: 'Gujarat',
		country: 'India',
		pin_code: '395007',
		department_id: 4,
		designation_id: 4,
		employment_type_id: 1,
		date_of_joining: '2023-03-01',
		employment_status: 'Probation',
		reporting_manager_id: 2,
		profile_photo_url: '',
		is_admin: false,
		last_login_at: '2024-12-22T10:00:00Z',
		createdAt: '2023-03-01T05:45:00Z',
		updatedAt: '2024-12-24T06:30:00Z',
	},
]

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
})

const toDisplayUser = (user) => {
	const fullName = user.full_name || [user.first_name, user.middle_name, user.last_name]
		.filter(Boolean)
		.join(' ')

	const departmentName = user.department_name || DEPARTMENT_MAP[user.department_id]
	const designationName = user.designation_name || DESIGNATION_MAP[user.designation_id]
	const managerName = user.reporting_manager_name || MANAGER_MAP[user.reporting_manager_id]
	const employmentType = user.employment_type || EMPLOYMENT_TYPE_MAP[user.employment_type_id]

	return {
		...user,
		full_name: fullName || user.username,
		department_name: departmentName,
		designation_name: designationName,
		reporting_manager_name: managerName,
		employment_type: employmentType,
	}
}

const fallbackList = () => FALLBACK_USERS.map((user) => toDisplayUser(user))

export const userApi = {
	/**
	 * Fetch all users from backend with a safe fallback to local data.
	 */
	getAll: async () => {
		try {
			const response = await apiClient.get('/users')
			const data = Array.isArray(response?.data) ? response.data : []
			if (!data.length) return fallbackList()
			return data.map((user) => toDisplayUser(user))
		} catch (error) {
			console.error('Failed to fetch users, serving fallback data', error)
			return fallbackList()
		}
	},

	/**
	 * Fetch a single user by id with a safe fallback.
	 */
	getById: async (id) => {
		try {
			const response = await apiClient.get(`/users/${id}`)
			return toDisplayUser(response?.data || {})
		} catch (error) {
			const fallbackUser = FALLBACK_USERS.find((user) => `${user.user_id}` === `${id}`)
			return fallbackUser ? toDisplayUser(fallbackUser) : null
		}
	},
}
