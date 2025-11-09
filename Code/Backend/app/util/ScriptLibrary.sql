CREATE DATABASE library_db;

-- TABLE: Category
CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- TABLE: User
CREATE TABLE app_user (
  user_id SERIAL PRIMARY KEY,
  auth_id INT,  -- Reference to user ID from MySQL Auth Service
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active'
);

-- TABLE: Book
CREATE TABLE book (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  author VARCHAR(100) NOT NULL,
  publication_year INT,
  isbn VARCHAR(50) UNIQUE NOT NULL,
  category_id INT REFERENCES category(category_id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'available' -- values: available, loaned
);

-- TABLE: Loan
CREATE TABLE loan (
  loan_id SERIAL PRIMARY KEY,
  book_id INT REFERENCES book(book_id) ON DELETE CASCADE,
  user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
  loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  return_date DATE,
  status VARCHAR(20) DEFAULT 'active' -- values: active, returned
);


INSERT INTO category (name, description)
VALUES
('Fiction', 'Novels and stories from various authors and genres.'),
('Science', 'Books related to physics, biology, and chemistry.'),
('Technology', 'Resources about computing, programming, and innovation.'),
('History', 'Books that explore global and local historical events.'),
('Art', 'Artistic movements, painting, music, and design.');



INSERT INTO app_user (auth_id, full_name, email, phone, status)
VALUES
(1, 'John Doe', 'john.doe@example.com', '3001112233', 'active'),
(2, 'Jane Smith', 'jane.smith@example.com', '3002223344', 'active'),
(3, 'Carlos Rodríguez', 'carlos.rod@example.com', '3105556677', 'active'),
(4, 'Maria Lopez', 'maria.lopez@example.com', '3129991122', 'inactive'),
(5, 'Laura Torres', 'laura.torres@example.com', '3157778899', 'active');



INSERT INTO book (title, author, publication_year, isbn, category_id, status)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 1925, '9780743273565', 1, 'available'),
('A Brief History of Time', 'Stephen Hawking', 1988, '9780553380163', 2, 'available'),
('Clean Code', 'Robert C. Martin', 2008, '9780132350884', 3, 'loaned'),
('The Art of War', 'Sun Tzu', -500, '9781599869773', 4, 'available'),
('The Design of Everyday Things', 'Don Norman', 1988, '9780465050659', 5, 'available'),
('Introduction to Algorithms', 'Thomas H. Cormen', 2009, '9780262033848', 3, 'loaned');



INSERT INTO loan (book_id, user_id, loan_date, return_date, status)
VALUES
(3, 1, '2025-10-10', NULL, 'active'),  -- John borrowed "Clean Code"
(6, 2, '2025-09-20', '2025-10-05', 'returned'), -- Jane borrowed "Intro to Algorithms"
(3, 3, '2025-08-15', '2025-08-25', 'returned'); -- Carlos borrowed "Clean Code"
