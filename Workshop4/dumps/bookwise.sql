--
-- PostgreSQL database dump
--

\restrict 5wlei6CKPnf5AC1Di0fpUyTNYlc37hVbvlYNimB7H41ghQ0xy8zry0pfMwnwIha

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 15.15 (Debian 15.15-1.pgdg13+1)

-- Started on 2025-11-24 15:32:04 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16390)
-- Name: app_user; Type: TABLE; Schema: public; Owner: bookwise
--

CREATE TABLE public.app_user (
    user_id integer NOT NULL,
    auth_id integer,
    full_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20),
    status character varying(20)
);


ALTER TABLE public.app_user OWNER TO bookwise;

--
-- TOC entry 214 (class 1259 OID 16389)
-- Name: app_user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: bookwise
--

CREATE SEQUENCE public.app_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_user_user_id_seq OWNER TO bookwise;

--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 214
-- Name: app_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bookwise
--

ALTER SEQUENCE public.app_user_user_id_seq OWNED BY public.app_user.user_id;


--
-- TOC entry 219 (class 1259 OID 16412)
-- Name: book; Type: TABLE; Schema: public; Owner: bookwise
--

CREATE TABLE public.book (
    book_id integer NOT NULL,
    title character varying(150) NOT NULL,
    author character varying(100) NOT NULL,
    publication_year integer,
    isbn character varying(50) NOT NULL,
    status character varying(20),
    category_id integer
);


ALTER TABLE public.book OWNER TO bookwise;

--
-- TOC entry 218 (class 1259 OID 16411)
-- Name: book_book_id_seq; Type: SEQUENCE; Schema: public; Owner: bookwise
--

CREATE SEQUENCE public.book_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.book_book_id_seq OWNER TO bookwise;

--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 218
-- Name: book_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bookwise
--

ALTER SEQUENCE public.book_book_id_seq OWNED BY public.book.book_id;


--
-- TOC entry 217 (class 1259 OID 16400)
-- Name: category; Type: TABLE; Schema: public; Owner: bookwise
--

CREATE TABLE public.category (
    category_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying
);


ALTER TABLE public.category OWNER TO bookwise;

--
-- TOC entry 216 (class 1259 OID 16399)
-- Name: category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: bookwise
--

CREATE SEQUENCE public.category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_category_id_seq OWNER TO bookwise;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 216
-- Name: category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bookwise
--

ALTER SEQUENCE public.category_category_id_seq OWNED BY public.category.category_id;


--
-- TOC entry 221 (class 1259 OID 16427)
-- Name: loan; Type: TABLE; Schema: public; Owner: bookwise
--

CREATE TABLE public.loan (
    loan_id integer NOT NULL,
    book_id integer,
    user_id integer,
    loan_date date,
    return_date date,
    status character varying(20)
);


ALTER TABLE public.loan OWNER TO bookwise;

--
-- TOC entry 220 (class 1259 OID 16426)
-- Name: loan_loan_id_seq; Type: SEQUENCE; Schema: public; Owner: bookwise
--

CREATE SEQUENCE public.loan_loan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loan_loan_id_seq OWNER TO bookwise;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 220
-- Name: loan_loan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bookwise
--

ALTER SEQUENCE public.loan_loan_id_seq OWNED BY public.loan.loan_id;


--
-- TOC entry 3278 (class 2604 OID 16393)
-- Name: app_user user_id; Type: DEFAULT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.app_user ALTER COLUMN user_id SET DEFAULT nextval('public.app_user_user_id_seq'::regclass);


--
-- TOC entry 3280 (class 2604 OID 16415)
-- Name: book book_id; Type: DEFAULT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.book ALTER COLUMN book_id SET DEFAULT nextval('public.book_book_id_seq'::regclass);


--
-- TOC entry 3279 (class 2604 OID 16403)
-- Name: category category_id; Type: DEFAULT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.category ALTER COLUMN category_id SET DEFAULT nextval('public.category_category_id_seq'::regclass);


--
-- TOC entry 3281 (class 2604 OID 16430)
-- Name: loan loan_id; Type: DEFAULT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.loan ALTER COLUMN loan_id SET DEFAULT nextval('public.loan_loan_id_seq'::regclass);


--
-- TOC entry 3446 (class 0 OID 16390)
-- Dependencies: 215
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: bookwise
--

COPY public.app_user (user_id, auth_id, full_name, email, phone, status) FROM stdin;
1	1	john.doe	john.doe@example.com	\N	active
\.


--
-- TOC entry 3450 (class 0 OID 16412)
-- Dependencies: 219
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: bookwise
--

COPY public.book (book_id, title, author, publication_year, isbn, status, category_id) FROM stdin;
3	Ways of Seeing	John Berger	1972	9780140135152	available	5
8	The Great Gatsby	F. Scott Fitzgerald	1925	9780743273565	Available	\N
9	A Brief History of Time	Stephen Hawking	1988	9780553380163	Available	\N
10	Sapiens: A Brief History of Humankind	Yuval Noah Harari	2015	9780062316110	Available	\N
11	The Selfish Gene	Richard Dawkins	1976	9780198788607	Available	\N
12	The Gene: An Intimate History	Siddhartha Mukherjee	2016	9781476733524	Available	\N
13	Cosmos	Carl Sagan	1980	9780345539434	Available	\N
15	The Pragmatic Programmer	Andrew Hunt, David Thomas	1999	9780201616224	Available	\N
16	Design Patterns: Elements of Reusable Object-Oriented Software	Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides	1994	9780201633610	Available	\N
17	Artificial Intelligence: A Modern Approach	Stuart Russell, Peter Norvig	2021	9780134610993	Available	\N
4	To Kill a Mockingbird	Harper Lee	1960	9780061120084	Available	1
5	1984	George Orwell	1949	9780451524935	Available	1
6	The Catcher in the Rye	J.D. Salinger	1951	9780316769488	available	1
7	The Hobbit	J.R.R. Tolkien	1937	9780547928227	unavailable	1
18	The Story of Art	E.H. Gombrich	1950	9780714832470	available	5
1	El Principito	Antoine de Saint-Exupéry	1943	9781234567890	available	1
14	Clean Code	Robert C. Martin	2008	9780132350884	loaned	2
\.


--
-- TOC entry 3448 (class 0 OID 16400)
-- Dependencies: 217
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: bookwise
--

COPY public.category (category_id, name, description) FROM stdin;
1	Fiction	Imaginary narratives that tell stories created by the author, including novels, short stories, and narrative literature.
2	Science	Books that explain scientific concepts, discoveries, theories, and studies related to the natural world and the universe.
3	Technology	Works focused on technological advances, programming, software engineering, artificial intelligence, and applied sciences.
4	History	Books that document, analyze, or explore past events, civilizations, cultures, and historical processes.
5	Art	Material related to visual arts, design, painting, sculpture, art history, and artistic theory.
\.


--
-- TOC entry 3452 (class 0 OID 16427)
-- Dependencies: 221
-- Data for Name: loan; Type: TABLE DATA; Schema: public; Owner: bookwise
--

COPY public.loan (loan_id, book_id, user_id, loan_date, return_date, status) FROM stdin;
1	1	1	2025-11-30	2025-11-24	returned
2	14	1	2025-12-05	\N	active
\.


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 214
-- Name: app_user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bookwise
--

SELECT pg_catalog.setval('public.app_user_user_id_seq', 1, true);


--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 218
-- Name: book_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bookwise
--

SELECT pg_catalog.setval('public.book_book_id_seq', 18, true);


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 216
-- Name: category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bookwise
--

SELECT pg_catalog.setval('public.category_category_id_seq', 5, true);


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 220
-- Name: loan_loan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bookwise
--

SELECT pg_catalog.setval('public.loan_loan_id_seq', 2, true);


--
-- TOC entry 3283 (class 2606 OID 16397)
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- TOC entry 3285 (class 2606 OID 16395)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3293 (class 2606 OID 16419)
-- Name: book book_isbn_key; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_isbn_key UNIQUE (isbn);


--
-- TOC entry 3295 (class 2606 OID 16417)
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (book_id);


--
-- TOC entry 3288 (class 2606 OID 16409)
-- Name: category category_name_key; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_name_key UNIQUE (name);


--
-- TOC entry 3290 (class 2606 OID 16407)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- TOC entry 3299 (class 2606 OID 16432)
-- Name: loan loan_pkey; Type: CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.loan
    ADD CONSTRAINT loan_pkey PRIMARY KEY (loan_id);


--
-- TOC entry 3286 (class 1259 OID 16398)
-- Name: ix_app_user_user_id; Type: INDEX; Schema: public; Owner: bookwise
--

CREATE INDEX ix_app_user_user_id ON public.app_user USING btree (user_id);


--
-- TOC entry 3296 (class 1259 OID 16425)
-- Name: ix_book_book_id; Type: INDEX; Schema: public; Owner: bookwise
--

CREATE INDEX ix_book_book_id ON public.book USING btree (book_id);


--
-- TOC entry 3291 (class 1259 OID 16410)
-- Name: ix_category_category_id; Type: INDEX; Schema: public; Owner: bookwise
--

CREATE INDEX ix_category_category_id ON public.category USING btree (category_id);


--
-- TOC entry 3297 (class 1259 OID 16443)
-- Name: ix_loan_loan_id; Type: INDEX; Schema: public; Owner: bookwise
--

CREATE INDEX ix_loan_loan_id ON public.loan USING btree (loan_id);


--
-- TOC entry 3300 (class 2606 OID 16420)
-- Name: book book_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(category_id);


--
-- TOC entry 3301 (class 2606 OID 16433)
-- Name: loan loan_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.loan
    ADD CONSTRAINT loan_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.book(book_id);


--
-- TOC entry 3302 (class 2606 OID 16438)
-- Name: loan loan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bookwise
--

ALTER TABLE ONLY public.loan
    ADD CONSTRAINT loan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.app_user(user_id);


-- Completed on 2025-11-24 15:32:04 UTC

--
-- PostgreSQL database dump complete
--

\unrestrict 5wlei6CKPnf5AC1Di0fpUyTNYlc37hVbvlYNimB7H41ghQ0xy8zry0pfMwnwIha

