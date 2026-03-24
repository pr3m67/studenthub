import { http } from "./http";

export const authService = {
  login: (payload) => http.post("/auth/login/", payload),
  register: (payload) => http.post("/auth/register/", payload),
  logout: () => http.post("/auth/logout/", {}),
  passwordReset: (payload) => http.post("/auth/password-reset/", payload),
  passwordConfirm: (payload) => http.post("/auth/password-confirm/", payload),
};

export const userService = {
  profile: () => http.get("/user/profile/"),
  updateProfile: (payload) => http.put("/user/profile/", payload, { headers: { "Content-Type": "multipart/form-data" } }),
};

export const timetableService = {
  upload: (payload) => http.post("/timetable/upload/", payload, { headers: { "Content-Type": "multipart/form-data" } }),
  today: () => http.get("/timetable/today/"),
  week: () => http.get("/timetable/week/"),
};

export const attendanceService = {
  summary: () => http.get("/attendance/summary/"),
  calendar: () => http.get("/attendance/calendar/"),
  prediction: () => http.get("/attendance/prediction/"),
  mark: (payload) => http.post("/attendance/mark/", payload),
  teacherBoard: (params) => http.get("/attendance/teacher-board/", { params }),
  submitTeacherBoard: (payload) => http.post("/attendance/teacher-board/", payload),
};

export const resultsService = {
  all: () => http.get("/results/"),
  cgpa: () => http.get("/results/cgpa/"),
  comparison: () => http.get("/results/comparison/"),
  backlogs: () => http.get("/results/backlogs/"),
  predict: (payload) => http.post("/results/predict/", payload),
};

export const eventsService = {
  all: (params) => http.get("/events/", { params }),
  create: (payload) => http.post("/events/", payload),
  toggleInterested: (id) => http.post(`/events/${id}/interested/`),
  toggleGoing: (id) => http.post(`/events/${id}/going/`),
};

export const clubsService = {
  all: (params) => http.get("/clubs/", { params }),
  detail: (id) => http.get(`/clubs/${id}/`),
  join: (id) => http.post(`/clubs/${id}/join/`),
  posts: (id, params) => http.get(`/clubs/${id}/posts/`, { params }),
};

export const noticesService = {
  all: (params) => http.get("/notices/", { params }),
  create: (payload) => http.post("/notices/", payload),
  markRead: (id) => http.patch(`/notices/${id}/read/`),
};

export const studytoolsService = {
  tasks: () => http.get("/studytools/tasks/"),
  createTask: (payload) => http.post("/studytools/tasks/", payload),
  updateTask: (id, payload) => http.patch(`/studytools/tasks/${id}/`, payload),
  deleteTask: (id) => http.delete(`/studytools/tasks/${id}/`),
  notes: () => http.get("/studytools/notes/"),
  upsertNote: (payload) => http.post("/studytools/notes/", payload),
};

export const placementService = {
  all: () => http.get("/placement/"),
  toggleInterest: (id) => http.post(`/placement/${id}/interest/`),
  uploadResume: (payload) => http.post("/placement/resume/", payload, { headers: { "Content-Type": "multipart/form-data" } }),
};

export const weatherService = {
  campus: async () => ({
    data: {
      data: {
        temp: "28°C",
        condition: "Breezy",
      },
    },
  }),
};
