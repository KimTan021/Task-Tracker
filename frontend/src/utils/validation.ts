export const USERNAME_PATTERN = /^[A-Za-z0-9._-]+$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)\S+$/;

export const LIMITS = {
  usernameMin: 3,
  usernameMax: 30,
  emailMax: 255,
  passwordMin: 8,
  passwordMax: 72,
  projectNameMin: 3,
  projectNameMax: 120,
  projectDescriptionMax: 1000,
  taskTitleMax: 120,
  taskDescriptionMax: 1000,
  taskTagsMax: 255,
  collaboratorSearchMin: 2,
} as const;

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

const isBlank = (value: string) => value.trim().length === 0;

export const validateUsername = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Username is required.';
  if (trimmed.length < LIMITS.usernameMin || trimmed.length > LIMITS.usernameMax) {
    return `Username must be between ${LIMITS.usernameMin} and ${LIMITS.usernameMax} characters.`;
  }
  if (!USERNAME_PATTERN.test(trimmed)) {
    return 'Username may only contain letters, numbers, periods, underscores, and hyphens.';
  }
  return '';
};

export const validateEmail = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required.';
  if (trimmed.length > LIMITS.emailMax) return `Email must be ${LIMITS.emailMax} characters or fewer.`;
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
  return '';
};

export const validatePassword = (value: string) => {
  if (!value) return 'Password is required.';
  if (value.length < LIMITS.passwordMin || value.length > LIMITS.passwordMax) {
    return `Password must be between ${LIMITS.passwordMin} and ${LIMITS.passwordMax} characters.`;
  }
  if (!PASSWORD_PATTERN.test(value)) {
    return 'Password must contain at least one letter and one number, and must not contain spaces.';
  }
  return '';
};

export const validateLoginForm = (values: { username: string; password: string }) => ({
  username: isBlank(values.username) ? 'Username is required.' : '',
  password: values.password ? '' : 'Password is required.',
});

export const validateRegisterForm = (values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors = {
    name: validateUsername(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: '',
  };

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export const validateProjectForm = (values: { projectName: string; projectDescription: string }) => {
  const errors = {
    projectName: '',
    projectDescription: '',
  };

  const name = values.projectName.trim();
  const description = values.projectDescription.trim();

  if (!name) {
    errors.projectName = 'Project name is required.';
  } else if (name.length < LIMITS.projectNameMin || name.length > LIMITS.projectNameMax) {
    errors.projectName = `Project name must be between ${LIMITS.projectNameMin} and ${LIMITS.projectNameMax} characters.`;
  }

  if (description.length > LIMITS.projectDescriptionMax) {
    errors.projectDescription = `Project description must be ${LIMITS.projectDescriptionMax} characters or fewer.`;
  }

  return errors;
};

export const validateCollaboratorSearch = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.length < LIMITS.collaboratorSearchMin) {
    return `Enter at least ${LIMITS.collaboratorSearchMin} characters to search.`;
  }
  if (trimmed.length > LIMITS.usernameMax) {
    return `Username search must be ${LIMITS.usernameMax} characters or fewer.`;
  }
  if (!USERNAME_PATTERN.test(trimmed)) {
    return 'Search using letters, numbers, periods, underscores, or hyphens only.';
  }
  return '';
};

export const validateTaskForm = (values: {
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  tags?: string[];
}) => {
  const errors = {
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    tags: '',
  };

  const title = values.title.trim();
  const description = values.description?.trim() ?? '';
  const tagString = (values.tags ?? []).join(',');

  if (!title) {
    errors.title = 'Task title is required.';
  } else if (title.length > LIMITS.taskTitleMax) {
    errors.title = `Task title must be ${LIMITS.taskTitleMax} characters or fewer.`;
  }

  if (description.length > LIMITS.taskDescriptionMax) {
    errors.description = `Task description must be ${LIMITS.taskDescriptionMax} characters or fewer.`;
  }

  if (tagString.length > LIMITS.taskTagsMax) {
    errors.tags = `Task tags must be ${LIMITS.taskTagsMax} characters or fewer in total.`;
  }

  if (values.startDate && Number.isNaN(new Date(values.startDate).getTime())) {
    errors.startDate = 'Enter a valid start date.';
  }

  if (values.dueDate && Number.isNaN(new Date(values.dueDate).getTime())) {
    errors.dueDate = 'Enter a valid due date.';
  }

  if (values.startDate && values.dueDate) {
    const start = new Date(values.startDate).getTime();
    const due = new Date(values.dueDate).getTime();
    if (!Number.isNaN(start) && !Number.isNaN(due) && due < start) {
      errors.dueDate = 'Due date must be on or after the start date.';
    }
  }

  return errors;
};

export const hasErrors = <T extends string>(errors: FieldErrors<T>) => Object.values(errors).some(Boolean);
