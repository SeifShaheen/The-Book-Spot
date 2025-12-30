-- Seed Data for Bookstore System (150 records each)
-- Compatible with Node.js mysql2 driver (no DELIMITER/stored procedures)

-- Disable foreign key checks to allow data insertion without constraint violations
SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- 1. Publishers (150)
-- =====================================================
INSERT INTO Publisher (Name) VALUES
('Penguin Random House'),('HarperCollins'),('Simon & Schuster'),('Hachette Book Group'),('Macmillan Publishers'),
('Scholastic'),('Pearson'),('Oxford University Press'),('Cambridge University Press'),('McGraw-Hill'),
('Wiley'),('Springer'),('Elsevier'),('Thomson Reuters'),('Wolters Kluwer'),
('Cengage'),('SAGE Publications'),('Taylor & Francis'),('Bloomsbury'),('Houghton Mifflin'),
('Random House'),('Vintage Books'),('Anchor Books'),('Doubleday'),('Knopf'),
('Crown Publishing'),('Ballantine Books'),('Del Rey'),('Bantam'),('Broadway Books'),
('Little Brown'),('Grand Central'),('Orbit Books'),('Hyperion'),('Disney Publishing'),
('Tor Books'),('Forge Books'),('St. Martins Press'),('Minotaur Books'),('Picador'),
('Farrar Straus'),('Hill and Wang'),('North Point Press'),('Metropolitan Books'),('Times Books'),
('Basic Books'),('PublicAffairs'),('Da Capo Press'),('Running Press'),('Seal Press'),
('Algonquin Books'),('Workman Publishing'),('Artisan Books'),('Timber Press'),('Storey Publishing'),
('Chronicle Books'),('Quirk Books'),('Ten Speed Press'),('Clarkson Potter'),('Watson-Guptill'),
('Rodale Books'),('Harmony Books'),('Convergent Books'),('Image Books'),('WaterBrook'),
('Multnomah'),('Revell'),('Bethany House'),('Baker Books'),('Zondervan'),
('Thomas Nelson'),('B&H Publishing'),('Tyndale House'),('NavPress'),('InterVarsity Press'),
('Crossway'),('Moody Publishers'),('David C Cook'),('Harvest House'),('Barbour Publishing'),
('Abingdon Press'),('Upper Room Books'),('Westminster John Knox'),('Fortress Press'),('Augsburg'),
('Eerdmans'),('Brazos Press'),('IVP Academic'),('Baker Academic'),('Kregel'),
('New Leaf'),('Whitaker House'),('Charisma House'),('Destiny Image'),('Harrison House'),
('Faith Words'),('Center Street'),('Worthy Publishing'),('Howard Books'),('Atria Books'),
('Gallery Books'),('Pocket Books'),('Scribner'),('Touchstone'),('Free Press'),
('Threshold Editions'),('Mercury Ink'),('North Star Way'),('Enliven Books'),('37 INK'),
('Amistad'),('Avon Books'),('Dey Street'),('Ecco Press'),('Harper Perennial'),
('Harper Voyager'),('Harper Wave'),('William Morrow'),('Witness Impulse'),('Graydon House'),
('Hanover Square'),('Harlequin'),('HQN Books'),('Kimani Press'),('Love Inspired'),
('Mira Books'),('Park Row'),('Red Tower Books'),('Silhouette'),('Carina Press'),
('Entangled Publishing'),('Montlake Romance'),('Lake Union'),('Thomas Mercer'),('47North'),
('Two Lions'),('Skyscape'),('Topple Books'),('Mindy McGinnis'),('Little A'),
('Amazon Crossing'),('AmazonEncore'),('Jet City Comics'),('Day One'),('Grand Harbor'),
('Waterfall Press'),('Brilliance Audio'),('Audible Studios'),('Blackstone Audio'),('Recorded Books');

-- =====================================================
-- 2. Publisher Phones (150)
-- =====================================================
INSERT INTO PublisherPhone (PublisherID, PhoneNumber)
SELECT PublisherID, CONCAT('+1-555-', LPAD(PublisherID, 4, '0')) FROM Publisher;

-- =====================================================
-- 3. Publisher Addresses (150)
-- =====================================================
INSERT INTO PublisherAddress (PublisherID, AddressLine1, City, Region, PostalCode, Country)
SELECT PublisherID, CONCAT(PublisherID, ' Publishing Ave'), 'New York', 'NY', LPAD(10000 + PublisherID, 5, '0'), 'USA'
FROM Publisher;

-- =====================================================
-- 4. Authors (150)
-- =====================================================
INSERT INTO Author (Name) VALUES
('Stephen King'),('J.K. Rowling'),('Dan Brown'),('Malcolm Gladwell'),('Yuval Noah Harari'),
('Michelle Obama'),('James Clear'),('Carl Sagan'),('Neil deGrasse Tyson'),('Bill Bryson'),
('George Orwell'),('Jane Austen'),('Mark Twain'),('Ernest Hemingway'),('F. Scott Fitzgerald'),
('Charles Dickens'),('Leo Tolstoy'),('Fyodor Dostoevsky'),('Gabriel Garcia Marquez'),('Jorge Luis Borges'),
('Virginia Woolf'),('James Joyce'),('Franz Kafka'),('Albert Camus'),('Hermann Hesse'),
('Haruki Murakami'),('Paulo Coelho'),('Khaled Hosseini'),('Chimamanda Ngozi Adichie'),('Kazuo Ishiguro'),
('Salman Rushdie'),('Arundhati Roy'),('Amitav Ghosh'),('Jhumpa Lahiri'),('Vikram Seth'),
('Roald Dahl'),('C.S. Lewis'),('J.R.R. Tolkien'),('Agatha Christie'),('Arthur Conan Doyle'),
('Isaac Asimov'),('Ray Bradbury'),('Philip K. Dick'),('Ursula K. Le Guin'),('Frank Herbert'),
('George R.R. Martin'),('Brandon Sanderson'),('Patrick Rothfuss'),('Terry Pratchett'),('Neil Gaiman'),
('Margaret Atwood'),('Octavia Butler'),('N.K. Jemisin'),('Becky Chambers'),('Ann Leckie'),
('John Grisham'),('Michael Crichton'),('Tom Clancy'),('Lee Child'),('James Patterson'),
('Dean Koontz'),('Clive Cussler'),('Robin Cook'),('Tess Gerritsen'),('Karin Slaughter'),
('Gillian Flynn'),('Paula Hawkins'),('Liane Moriarty'),('Lisa Gardner'),('Harlan Coben'),
('David Baldacci'),('Brad Thor'),('Vince Flynn'),('Daniel Silva'),('Nelson DeMille'),
('Ken Follett'),('Jeffrey Archer'),('Sidney Sheldon'),('Danielle Steel'),('Nicholas Sparks'),
('Nora Roberts'),('Janet Evanovich'),('Sandra Brown'),('Karen Rose'),('J.D. Robb'),
('Louise Penny'),('Tana French'),('Ruth Ware'),('A.J. Finn'),('Riley Sager'),
('Colleen Hoover'),('Emily Henry'),('Ali Hazelwood'),('Beth OLeary'),('Sally Rooney'),
('Taylor Jenkins Reid'),('Madeline Miller'),('Elin Hilderbrand'),('Kristin Hannah'),('Jodi Picoult'),
('Celeste Ng'),('Lisa See'),('Chris Bohjalian'),('Ann Patchett'),('Fredrik Backman'),
('Matt Haig'),('Gabrielle Zevin'),('Leigh Bardugo'),('Sarah J. Maas'),('Holly Black'),
('Victoria Aveyard'),('Sabaa Tahir'),('Renee Ahdieh'),('Marie Lu'),('Cassandra Clare'),
('Veronica Roth'),('Suzanne Collins'),('Rick Riordan'),('John Green'),('Rainbow Rowell'),
('Angie Thomas'),('Nicola Yoon'),('Adam Silvera'),('Becky Albertalli'),('Jennifer Niven'),
('Jason Reynolds'),('Kwame Alexander'),('Elizabeth Acevedo'),('Jacqueline Woodson'),('Walter Dean Myers'),
('Sharon Draper'),('Meg Cabot'),('Sarah Dessen'),('Jenny Han'),('Morgan Matson'),
('Kasie West'),('Stephanie Perkins'),('Anna Todd'),('Colleen Hoover'),('Penelope Douglas'),
('Elle Kennedy'),('Mariana Zapata'),('Helena Hunting'),('Meghan Quinn'),('L.J. Shen'),
('Sarina Bowen'),('Adriana Locke'),('Kennedy Ryan'),('Brittainy Cherry'),('Mia Sheridan');

-- =====================================================
-- 5. Books (150)
-- =====================================================
INSERT INTO Book (ISBN, Title, Category, Price, PublicationYear, StockQuantity, Threshold, PublisherID) VALUES
('978-1501142970', 'The Outsider', 'History', 28.99, 2018, 50, 10, 1),
('978-0439708180', 'Harry Potter and the Sorcerers Stone', 'Art', 12.99, 1998, 100, 20, 2),
('978-0385504201', 'The Da Vinci Code', 'Religion', 17.00, 2003, 75, 15, 3),
('978-0316017930', 'Outliers', 'Science', 18.99, 2008, 60, 12, 4),
('978-0062316110', 'Sapiens A Brief History', 'History', 24.99, 2015, 80, 15, 5),
('978-1524763138', 'Becoming', 'History', 32.50, 2018, 90, 18, 6),
('978-0735211292', 'Atomic Habits', 'Science', 27.00, 2018, 120, 25, 7),
('978-0345539434', 'Cosmos', 'Science', 18.00, 2013, 45, 10, 8),
('978-0393355673', 'Astrophysics for People in a Hurry', 'Science', 18.95, 2017, 55, 12, 9),
('978-0767908184', 'A Short History of Nearly Everything', 'Geography', 18.00, 2004, 40, 8, 10),
('978-0000000011', 'The Great Adventure', 'Science', 25.99, 2020, 65, 15, 11),
('978-0000000012', 'Mystery of the Night', 'Art', 19.99, 2019, 70, 12, 12),
('978-0000000013', 'Journey to the Stars', 'Science', 22.50, 2021, 55, 10, 13),
('978-0000000014', 'Ancient Wisdom', 'Religion', 15.99, 2018, 85, 20, 14),
('978-0000000015', 'Modern Philosophy', 'History', 28.00, 2017, 45, 8, 15),
('978-0000000016', 'Digital Revolution', 'Science', 32.99, 2022, 90, 18, 16),
('978-0000000017', 'Art of Living', 'Art', 21.50, 2020, 75, 15, 17),
('978-0000000018', 'World Geography', 'Geography', 24.99, 2019, 60, 12, 18),
('978-0000000019', 'Sacred Texts', 'Religion', 18.99, 2016, 50, 10, 19),
('978-0000000020', 'Historical Tales', 'History', 26.00, 2021, 80, 16, 20),
('978-0000000021', 'Science Frontiers', 'Science', 29.99, 2022, 95, 20, 21),
('978-0000000022', 'Creative Minds', 'Art', 17.50, 2018, 65, 13, 22),
('978-0000000023', 'Earth Explored', 'Geography', 23.99, 2020, 70, 14, 23),
('978-0000000024', 'Faith and Reason', 'Religion', 20.00, 2019, 55, 11, 24),
('978-0000000025', 'Centuries Past', 'History', 31.50, 2017, 45, 9, 25),
('978-0000000026', 'Quantum Worlds', 'Science', 35.99, 2023, 100, 22, 26),
('978-0000000027', 'Artistic Vision', 'Art', 19.99, 2021, 80, 16, 27),
('978-0000000028', 'Continental Drift', 'Geography', 22.00, 2018, 60, 12, 28),
('978-0000000029', 'Spiritual Journey', 'Religion', 16.99, 2020, 75, 15, 29),
('978-0000000030', 'Empire Builders', 'History', 28.50, 2019, 50, 10, 30),
('978-0000000031', 'Lab Notes', 'Science', 24.99, 2022, 85, 17, 31),
('978-0000000032', 'Canvas Dreams', 'Art', 21.00, 2020, 70, 14, 32),
('978-0000000033', 'Ocean Depths', 'Geography', 26.99, 2021, 65, 13, 33),
('978-0000000034', 'Divine Wisdom', 'Religion', 18.50, 2018, 55, 11, 34),
('978-0000000035', 'War and Peace Studies', 'History', 33.00, 2017, 40, 8, 35),
('978-0000000036', 'Particle Physics', 'Science', 38.99, 2023, 90, 18, 36),
('978-0000000037', 'Modern Art Movement', 'Art', 25.50, 2022, 75, 15, 37),
('978-0000000038', 'Mountain Ranges', 'Geography', 20.99, 2019, 60, 12, 38),
('978-0000000039', 'Meditation Guide', 'Religion', 14.99, 2021, 95, 19, 39),
('978-0000000040', 'Renaissance Era', 'History', 29.00, 2020, 50, 10, 40),
('978-0000000041', 'Chemistry Basics', 'Science', 22.99, 2018, 80, 16, 41),
('978-0000000042', 'Sculpture Art', 'Art', 27.50, 2021, 65, 13, 42),
('978-0000000043', 'Desert Landscapes', 'Geography', 19.99, 2020, 70, 14, 43),
('978-0000000044', 'Prayer Book', 'Religion', 12.99, 2019, 100, 20, 44),
('978-0000000045', 'Industrial Age', 'History', 26.50, 2017, 45, 9, 45),
('978-0000000046', 'Biology Today', 'Science', 31.99, 2022, 85, 17, 46),
('978-0000000047', 'Photography Art', 'Art', 23.00, 2021, 75, 15, 47),
('978-0000000048', 'River Systems', 'Geography', 21.99, 2018, 60, 12, 48),
('978-0000000049', 'Holy Scriptures', 'Religion', 25.99, 2020, 55, 11, 49),
('978-0000000050', 'Medieval Times', 'History', 34.00, 2019, 40, 8, 50),
('978-0000000051', 'Genetics Guide', 'Science', 28.99, 2023, 90, 18, 51),
('978-0000000052', 'Digital Art', 'Art', 20.50, 2022, 80, 16, 52),
('978-0000000053', 'Climate Zones', 'Geography', 24.99, 2021, 65, 13, 53),
('978-0000000054', 'Mindfulness', 'Religion', 16.99, 2020, 95, 19, 54),
('978-0000000055', 'Colonial History', 'History', 27.50, 2018, 50, 10, 55),
('978-0000000056', 'Astronomy Now', 'Science', 33.99, 2022, 75, 15, 56),
('978-0000000057', 'Abstract Art', 'Art', 22.00, 2021, 70, 14, 57),
('978-0000000058', 'Volcanic Activity', 'Geography', 26.99, 2019, 60, 12, 58),
('978-0000000059', 'Yoga Practice', 'Religion', 18.99, 2020, 85, 17, 59),
('978-0000000060', 'Ancient Rome', 'History', 30.00, 2017, 45, 9, 60),
('978-0000000061', 'Neuroscience', 'Science', 36.99, 2023, 100, 20, 61),
('978-0000000062', 'Street Art', 'Art', 19.50, 2022, 80, 16, 62),
('978-0000000063', 'Island Nations', 'Geography', 23.99, 2021, 65, 13, 63),
('978-0000000064', 'Buddhist Teachings', 'Religion', 21.99, 2018, 55, 11, 64),
('978-0000000065', 'Greek History', 'History', 28.00, 2020, 50, 10, 65),
('978-0000000066', 'Environmental Science', 'Science', 25.99, 2019, 90, 18, 66),
('978-0000000067', 'Impressionism', 'Art', 24.50, 2021, 75, 15, 67),
('978-0000000068', 'Polar Regions', 'Geography', 20.99, 2020, 60, 12, 68),
('978-0000000069', 'Islamic Studies', 'Religion', 17.99, 2019, 95, 19, 69),
('978-0000000070', 'Egyptian Pharaohs', 'History', 32.00, 2018, 40, 8, 70),
('978-0000000071', 'Marine Biology', 'Science', 29.99, 2022, 85, 17, 71),
('978-0000000072', 'Pop Art', 'Art', 21.00, 2021, 70, 14, 72),
('978-0000000073', 'Rainforest Life', 'Geography', 25.99, 2020, 65, 13, 73),
('978-0000000074', 'Hindu Philosophy', 'Religion', 19.99, 2019, 55, 11, 74),
('978-0000000075', 'Viking Age', 'History', 26.50, 2017, 50, 10, 75),
('978-0000000076', 'Zoology', 'Science', 31.99, 2023, 100, 20, 76),
('978-0000000077', 'Surrealism', 'Art', 23.50, 2022, 80, 16, 77),
('978-0000000078', 'Coral Reefs', 'Geography', 22.99, 2021, 75, 15, 78),
('978-0000000079', 'Jewish Heritage', 'Religion', 20.99, 2020, 60, 12, 79),
('978-0000000080', 'Samurai Warriors', 'History', 29.00, 2019, 45, 9, 80),
('978-0000000081', 'Botany Basics', 'Science', 24.99, 2018, 90, 18, 81),
('978-0000000082', 'Cubism', 'Art', 25.00, 2021, 65, 13, 82),
('978-0000000083', 'Arctic Exploration', 'Geography', 27.99, 2020, 55, 11, 83),
('978-0000000084', 'Taoism', 'Religion', 16.99, 2019, 85, 17, 84),
('978-0000000085', 'Aztec Empire', 'History', 30.50, 2017, 40, 8, 85),
('978-0000000086', 'Ecology', 'Science', 28.99, 2022, 95, 19, 86),
('978-0000000087', 'Baroque Art', 'Art', 26.00, 2021, 70, 14, 87),
('978-0000000088', 'Sahara Desert', 'Geography', 21.99, 2020, 60, 12, 88),
('978-0000000089', 'Confucianism', 'Religion', 18.99, 2019, 75, 15, 89),
('978-0000000090', 'Ottoman Empire', 'History', 33.00, 2018, 50, 10, 90),
('978-0000000091', 'Microbiology', 'Science', 35.99, 2023, 80, 16, 91),
('978-0000000092', 'Renaissance Art', 'Art', 28.50, 2022, 65, 13, 92),
('978-0000000093', 'Amazon Basin', 'Geography', 24.99, 2021, 55, 11, 93),
('978-0000000094', 'Sikhism', 'Religion', 17.99, 2020, 90, 18, 94),
('978-0000000095', 'Mongol Conquests', 'History', 27.00, 2019, 45, 9, 95),
('978-0000000096', 'Paleontology', 'Science', 32.99, 2018, 100, 20, 96),
('978-0000000097', 'Gothic Art', 'Art', 22.50, 2021, 75, 15, 97),
('978-0000000098', 'Great Barrier Reef', 'Geography', 26.99, 2020, 60, 12, 98),
('978-0000000099', 'Shinto', 'Religion', 19.99, 2019, 70, 14, 99),
('978-0000000100', 'Byzantine Empire', 'History', 31.00, 2017, 40, 8, 100),
('978-0000000101', 'Pharmacology', 'Science', 38.99, 2023, 85, 17, 101),
('978-0000000102', 'Minimalism Art', 'Art', 20.00, 2022, 80, 16, 102),
('978-0000000103', 'Himalayan Region', 'Geography', 25.99, 2021, 65, 13, 103),
('978-0000000104', 'Zoroastrianism', 'Religion', 21.99, 2020, 55, 11, 104),
('978-0000000105', 'Crusades', 'History', 29.50, 2019, 50, 10, 105),
('978-0000000106', 'Immunology', 'Science', 34.99, 2018, 90, 18, 106),
('978-0000000107', 'Art Nouveau', 'Art', 24.00, 2021, 75, 15, 107),
('978-0000000108', 'Mediterranean Sea', 'Geography', 23.99, 2020, 60, 12, 108),
('978-0000000109', 'Jainism', 'Religion', 18.99, 2019, 95, 19, 109),
('978-0000000110', 'Napoleonic Wars', 'History', 32.00, 2017, 45, 9, 110),
('978-0000000111', 'Virology', 'Science', 36.99, 2023, 70, 14, 111),
('978-0000000112', 'Art Deco', 'Art', 25.50, 2022, 65, 13, 112),
('978-0000000113', 'Caribbean Islands', 'Geography', 22.99, 2021, 80, 16, 113),
('978-0000000114', 'Bahai Faith', 'Religion', 16.99, 2020, 55, 11, 114),
('978-0000000115', 'American Revolution', 'History', 28.00, 2019, 100, 20, 115),
('978-0000000116', 'Epidemiology', 'Science', 33.99, 2018, 75, 15, 116),
('978-0000000117', 'Expressionism', 'Art', 21.50, 2021, 60, 12, 117),
('978-0000000118', 'Pacific Islands', 'Geography', 27.99, 2020, 90, 18, 118),
('978-0000000119', 'Animism', 'Religion', 19.99, 2019, 45, 9, 119),
('978-0000000120', 'French Revolution', 'History', 30.00, 2017, 85, 17, 120),
('978-0000000121', 'Toxicology', 'Science', 37.99, 2023, 50, 10, 121),
('978-0000000122', 'Realism Art', 'Art', 23.00, 2022, 70, 14, 122),
('978-0000000123', 'Antarctic Region', 'Geography', 24.99, 2021, 65, 13, 123),
('978-0000000124', 'Shamanism', 'Religion', 20.99, 2020, 95, 19, 124),
('978-0000000125', 'Civil War', 'History', 26.50, 2019, 40, 8, 125),
('978-0000000126', 'Anatomy', 'Science', 31.99, 2018, 80, 16, 126),
('978-0000000127', 'Romanticism', 'Art', 22.00, 2021, 55, 11, 127),
('978-0000000128', 'African Savanna', 'Geography', 26.99, 2020, 100, 20, 128),
('978-0000000129', 'Paganism', 'Religion', 17.99, 2019, 75, 15, 129),
('978-0000000130', 'World War I', 'History', 34.00, 2017, 60, 12, 130),
('978-0000000131', 'Physiology', 'Science', 35.99, 2023, 90, 18, 131),
('978-0000000132', 'Neoclassicism', 'Art', 25.50, 2022, 45, 9, 132),
('978-0000000133', 'Tundra Biome', 'Geography', 21.99, 2021, 85, 17, 133),
('978-0000000134', 'Druidism', 'Religion', 18.99, 2020, 50, 10, 134),
('978-0000000135', 'World War II', 'History', 38.00, 2019, 70, 14, 135),
('978-0000000136', 'Biochemistry', 'Science', 39.99, 2018, 65, 13, 136),
('978-0000000137', 'Dadaism', 'Art', 20.50, 2021, 95, 19, 137),
('978-0000000138', 'Grasslands', 'Geography', 23.99, 2020, 40, 8, 138),
('978-0000000139', 'Wicca', 'Religion', 16.99, 2019, 80, 16, 139),
('978-0000000140', 'Cold War', 'History', 29.00, 2017, 55, 11, 140),
('978-0000000141', 'Biophysics', 'Science', 36.99, 2023, 100, 20, 141),
('978-0000000142', 'Constructivism', 'Art', 24.00, 2022, 75, 15, 142),
('978-0000000143', 'Wetlands Ecology', 'Geography', 25.99, 2021, 60, 12, 143),
('978-0000000144', 'New Age', 'Religion', 19.99, 2020, 90, 18, 144),
('978-0000000145', 'Modern History', 'History', 27.50, 2019, 45, 9, 145),
('978-0000000146', 'Nanotechnology', 'Science', 42.99, 2018, 85, 17, 146),
('978-0000000147', 'Futurism Art', 'Art', 21.00, 2021, 50, 10, 147),
('978-0000000148', 'Coastal Regions', 'Geography', 22.99, 2020, 70, 14, 148),
('978-0000000149', 'Spiritualism', 'Religion', 18.99, 2019, 65, 13, 149),
('978-0000000150', 'Contemporary History', 'History', 32.00, 2017, 95, 19, 150);

-- =====================================================
-- 6. BookAuthor (link books to authors)
-- =====================================================
INSERT INTO BookAuthor (ISBN, AuthorID)
SELECT b.ISBN, a.AuthorID
FROM Book b
JOIN Author a ON b.PublisherID = a.AuthorID
WHERE b.PublisherID <= 150;

-- =====================================================
-- 7. Note: Customers and Admin are created in init-db.js
-- =====================================================

-- =====================================================
-- 8. Sample Orders (for testing reports)
-- =====================================================
INSERT INTO `Order` (OrderDate, Status, TotalPrice, Username) VALUES
(DATE_SUB(NOW(), INTERVAL 1 DAY), 'Confirmed', 45.98, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 2 DAY), 'Confirmed', 27.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 3 DAY), 'Confirmed', 65.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 4 DAY), 'Confirmed', 89.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'Confirmed', 34.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 6 DAY), 'Pending', 125.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 7 DAY), 'Confirmed', 78.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 8 DAY), 'Confirmed', 156.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 9 DAY), 'Cancelled', 42.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 10 DAY), 'Confirmed', 98.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 11 DAY), 'Confirmed', 213.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 12 DAY), 'Confirmed', 67.80, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 13 DAY), 'Pending', 145.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 14 DAY), 'Confirmed', 88.90, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 15 DAY), 'Confirmed', 192.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 16 DAY), 'Confirmed', 54.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 17 DAY), 'Cancelled', 76.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 18 DAY), 'Confirmed', 134.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 19 DAY), 'Confirmed', 99.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 20 DAY), 'Confirmed', 167.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 21 DAY), 'Confirmed', 45.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 22 DAY), 'Pending', 112.80, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 23 DAY), 'Confirmed', 203.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 24 DAY), 'Confirmed', 87.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 25 DAY), 'Confirmed', 156.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 26 DAY), 'Cancelled', 64.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 27 DAY), 'Confirmed', 178.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 28 DAY), 'Confirmed', 92.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 29 DAY), 'Confirmed', 234.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 30 DAY), 'Confirmed', 118.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 31 DAY), 'Confirmed', 76.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 32 DAY), 'Pending', 189.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 33 DAY), 'Confirmed', 145.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 34 DAY), 'Confirmed', 67.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 35 DAY), 'Confirmed', 198.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 36 DAY), 'Cancelled', 82.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 37 DAY), 'Confirmed', 156.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 38 DAY), 'Confirmed', 94.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 39 DAY), 'Confirmed', 267.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 40 DAY), 'Confirmed', 123.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 41 DAY), 'Confirmed', 88.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 42 DAY), 'Pending', 201.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 43 DAY), 'Confirmed', 159.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 44 DAY), 'Confirmed', 72.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 45 DAY), 'Confirmed', 214.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 46 DAY), 'Cancelled', 95.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 47 DAY), 'Confirmed', 167.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 48 DAY), 'Confirmed', 103.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 49 DAY), 'Confirmed', 289.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 50 DAY), 'Confirmed', 134.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 51 DAY), 'Confirmed', 96.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 52 DAY), 'Pending', 218.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 53 DAY), 'Confirmed', 172.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 54 DAY), 'Confirmed', 84.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 55 DAY), 'Confirmed', 229.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 56 DAY), 'Cancelled', 107.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 57 DAY), 'Confirmed', 183.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 58 DAY), 'Confirmed', 115.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 59 DAY), 'Confirmed', 298.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 60 DAY), 'Confirmed', 146.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 61 DAY), 'Confirmed', 108.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 62 DAY), 'Pending', 234.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 63 DAY), 'Confirmed', 187.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 64 DAY), 'Confirmed', 95.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 65 DAY), 'Confirmed', 245.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 66 DAY), 'Cancelled', 119.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 67 DAY), 'Confirmed', 198.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 68 DAY), 'Confirmed', 126.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 69 DAY), 'Confirmed', 312.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 70 DAY), 'Confirmed', 158.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 71 DAY), 'Confirmed', 119.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 72 DAY), 'Pending', 251.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 73 DAY), 'Confirmed', 201.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 74 DAY), 'Confirmed', 106.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 75 DAY), 'Confirmed', 261.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 76 DAY), 'Cancelled', 131.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 77 DAY), 'Confirmed', 212.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 78 DAY), 'Confirmed', 138.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 79 DAY), 'Confirmed', 327.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 80 DAY), 'Confirmed', 169.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 81 DAY), 'Confirmed', 131.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 82 DAY), 'Pending', 268.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 83 DAY), 'Confirmed', 215.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 84 DAY), 'Confirmed', 118.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 85 DAY), 'Confirmed', 277.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 86 DAY), 'Cancelled', 143.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 87 DAY), 'Confirmed', 227.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 88 DAY), 'Confirmed', 149.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 89 DAY), 'Confirmed', 342.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 90 DAY), 'Confirmed', 181.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 91 DAY), 'Confirmed', 142.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 92 DAY), 'Pending', 284.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 93 DAY), 'Confirmed', 229.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 94 DAY), 'Confirmed', 130.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 95 DAY), 'Confirmed', 293.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 96 DAY), 'Cancelled', 155.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 97 DAY), 'Confirmed', 241.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 98 DAY), 'Confirmed', 160.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 99 DAY), 'Confirmed', 356.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 100 DAY), 'Confirmed', 193.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 101 DAY), 'Confirmed', 154.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 102 DAY), 'Pending', 301.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 103 DAY), 'Confirmed', 243.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 104 DAY), 'Confirmed', 142.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 105 DAY), 'Confirmed', 308.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 106 DAY), 'Cancelled', 166.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 107 DAY), 'Confirmed', 256.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 108 DAY), 'Confirmed', 172.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 109 DAY), 'Confirmed', 371.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 110 DAY), 'Confirmed', 205.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 111 DAY), 'Confirmed', 165.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 112 DAY), 'Pending', 318.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 113 DAY), 'Confirmed', 258.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 114 DAY), 'Confirmed', 153.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 115 DAY), 'Confirmed', 324.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 116 DAY), 'Cancelled', 178.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 117 DAY), 'Confirmed', 271.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 118 DAY), 'Confirmed', 183.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 119 DAY), 'Confirmed', 386.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 120 DAY), 'Confirmed', 217.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 121 DAY), 'Confirmed', 177.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 122 DAY), 'Pending', 334.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 123 DAY), 'Confirmed', 272.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 124 DAY), 'Confirmed', 165.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 125 DAY), 'Confirmed', 340.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 126 DAY), 'Cancelled', 190.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 127 DAY), 'Confirmed', 285.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 128 DAY), 'Confirmed', 195.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 129 DAY), 'Confirmed', 401.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 130 DAY), 'Confirmed', 228.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 131 DAY), 'Confirmed', 188.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 132 DAY), 'Pending', 351.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 133 DAY), 'Confirmed', 287.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 134 DAY), 'Confirmed', 177.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 135 DAY), 'Confirmed', 355.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 136 DAY), 'Cancelled', 201.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 137 DAY), 'Confirmed', 300.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 138 DAY), 'Confirmed', 206.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 139 DAY), 'Confirmed', 415.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 140 DAY), 'Confirmed', 240.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 141 DAY), 'Confirmed', 200.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 142 DAY), 'Pending', 367.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 143 DAY), 'Confirmed', 302.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 144 DAY), 'Confirmed', 188.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 145 DAY), 'Confirmed', 371.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 146 DAY), 'Cancelled', 213.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 147 DAY), 'Confirmed', 314.75, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 148 DAY), 'Confirmed', 218.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 149 DAY), 'Confirmed', 430.25, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 150 DAY), 'Confirmed', 251.99, 'johndoe');

-- =====================================================
-- 9. Sample Order Items
-- =====================================================
INSERT INTO OrderItem (OrderID, ISBN, Quantity) VALUES
(1, '978-0439708180', 2),
(1, '978-0316017930', 1),
(2, '978-0735211292', 1),
(3, '978-1501142970', 2),
(3, '978-0385504201', 1),
(4, '978-0062316110', 1),
(4, '978-1524763138', 2),
(5, '978-0345539434', 1),
(5, '978-0393355673', 1),
(6, '978-0767908184', 3),
(7, '978-0000000011', 2),
(7, '978-0000000012', 1),
(8, '978-0000000013', 4),
(9, '978-0000000014', 1),
(10, '978-0000000015', 2),
(10, '978-0000000016', 3),
(11, '978-0000000017', 5),
(11, '978-0000000018', 2),
(12, '978-0000000019', 1),
(13, '978-0000000020', 3),
(13, '978-0000000021', 2),
(14, '978-0000000022', 2),
(15, '978-0000000023', 4),
(15, '978-0000000024', 1),
(16, '978-0000000025', 1),
(17, '978-0000000026', 2),
(18, '978-0000000027', 3),
(18, '978-0000000028', 1),
(19, '978-0000000029', 2),
(20, '978-0000000030', 4),
(20, '978-0000000031', 1),
(21, '978-0000000032', 1),
(22, '978-0000000033', 2),
(22, '978-0000000034', 2),
(23, '978-0000000035', 5),
(23, '978-0000000036', 1),
(24, '978-0000000037', 2),
(25, '978-0000000038', 3),
(25, '978-0000000039', 2),
(26, '978-0000000040', 1),
(27, '978-0000000041', 4),
(28, '978-0000000042', 2),
(28, '978-0000000043', 1),
(29, '978-0000000044', 3),
(30, '978-0000000045', 2),
(30, '978-0000000046', 2),
(31, '978-0000000047', 1),
(32, '978-0000000048', 4),
(32, '978-0000000049', 1),
(33, '978-0000000050', 3),
(34, '978-0000000051', 1),
(35, '978-0000000052', 4),
(35, '978-0000000053', 2),
(36, '978-0000000054', 2),
(37, '978-0000000055', 3),
(37, '978-0000000056', 1),
(38, '978-0000000057', 2),
(39, '978-0000000058', 5),
(39, '978-0000000059', 2),
(40, '978-0000000060', 3),
(41, '978-0000000061', 2),
(42, '978-0000000062', 4),
(42, '978-0000000063', 1),
(43, '978-0000000064', 3),
(44, '978-0000000065', 1),
(45, '978-0000000066', 4),
(45, '978-0000000067', 2),
(46, '978-0000000068', 2),
(47, '978-0000000069', 3),
(47, '978-0000000070', 1),
(48, '978-0000000071', 2),
(49, '978-0000000072', 5),
(49, '978-0000000073', 3),
(50, '978-0000000074', 2),
(51, '978-0000000075', 2),
(52, '978-0000000076', 4),
(52, '978-0000000077', 1),
(53, '978-0000000078', 3),
(54, '978-0000000079', 1),
(55, '978-0000000080', 4),
(55, '978-0000000081', 2),
(56, '978-0000000082', 2),
(57, '978-0000000083', 3),
(57, '978-0000000084', 1),
(58, '978-0000000085', 2),
(59, '978-0000000086', 5),
(59, '978-0000000087', 2),
(60, '978-0000000088', 3),
(61, '978-0000000089', 2),
(62, '978-0000000090', 4),
(62, '978-0000000091', 1),
(63, '978-0000000092', 3),
(64, '978-0000000093', 1),
(65, '978-0000000094', 4),
(65, '978-0000000095', 2),
(66, '978-0000000096', 2),
(67, '978-0000000097', 3),
(67, '978-0000000098', 1),
(68, '978-0000000099', 2),
(69, '978-0000000100', 5),
(69, '978-0000000101', 2),
(70, '978-0000000102', 3),
(71, '978-0000000103', 2),
(72, '978-0000000104', 4),
(72, '978-0000000105', 1),
(73, '978-0000000106', 3),
(74, '978-0000000107', 1),
(75, '978-0000000108', 4),
(75, '978-0000000109', 2),
(76, '978-0000000110', 2),
(77, '978-0000000111', 3),
(77, '978-0000000112', 1),
(78, '978-0000000113', 2),
(79, '978-0000000114', 5),
(79, '978-0000000115', 2),
(80, '978-0000000116', 3),
(81, '978-0000000117', 2),
(82, '978-0000000118', 4),
(82, '978-0000000119', 1),
(83, '978-0000000120', 3),
(84, '978-0000000121', 1),
(85, '978-0000000122', 4),
(85, '978-0000000123', 2),
(86, '978-0000000124', 2),
(87, '978-0000000125', 3),
(87, '978-0000000126', 1),
(88, '978-0000000127', 2),
(89, '978-0000000128', 5),
(89, '978-0000000129', 2),
(90, '978-0000000130', 3),
(91, '978-0000000131', 2),
(92, '978-0000000132', 4),
(92, '978-0000000133', 1),
(93, '978-0000000134', 3),
(94, '978-0000000135', 1),
(95, '978-0000000136', 4),
(95, '978-0000000137', 2),
(96, '978-0000000138', 2),
(97, '978-0000000139', 3),
(97, '978-0000000140', 1),
(98, '978-0000000141', 2),
(99, '978-0000000142', 5),
(99, '978-0000000143', 2),
(100, '978-0000000144', 3),
(101, '978-0000000145', 2),
(102, '978-0000000146', 4),
(102, '978-0000000147', 1),
(103, '978-0000000148', 3),
(104, '978-0000000149', 1),
(105, '978-0000000150', 4),
(105, '978-1501142970', 2),
(106, '978-0439708180', 2),
(107, '978-0385504201', 3),
(107, '978-0316017930', 1),
(108, '978-0062316110', 2),
(109, '978-1524763138', 5),
(109, '978-0735211292', 2),
(110, '978-0345539434', 3),
(111, '978-0393355673', 2),
(112, '978-0767908184', 4),
(112, '978-0000000011', 1),
(113, '978-0000000012', 3),
(114, '978-0000000013', 1),
(115, '978-0000000014', 4),
(115, '978-0000000015', 2),
(116, '978-0000000016', 2),
(117, '978-0000000017', 3),
(117, '978-0000000018', 1),
(118, '978-0000000019', 2),
(119, '978-0000000020', 5),
(119, '978-0000000021', 2),
(120, '978-0000000022', 3),
(121, '978-0000000023', 2),
(122, '978-0000000024', 4),
(122, '978-0000000025', 1),
(123, '978-0000000026', 3),
(124, '978-0000000027', 1),
(125, '978-0000000028', 4),
(125, '978-0000000029', 2),
(126, '978-0000000030', 2),
(127, '978-0000000031', 3),
(127, '978-0000000032', 1),
(128, '978-0000000033', 2),
(129, '978-0000000034', 5),
(129, '978-0000000035', 2),
(130, '978-0000000036', 3),
(131, '978-0000000037', 2),
(132, '978-0000000038', 4),
(132, '978-0000000039', 1),
(133, '978-0000000040', 3),
(134, '978-0000000041', 1),
(135, '978-0000000042', 4),
(135, '978-0000000043', 2),
(136, '978-0000000044', 2),
(137, '978-0000000045', 3),
(137, '978-0000000046', 1),
(138, '978-0000000047', 2),
(139, '978-0000000048', 5),
(139, '978-0000000049', 2),
(140, '978-0000000050', 3),
(141, '978-0000000051', 2),
(142, '978-0000000052', 4),
(142, '978-0000000053', 1),
(143, '978-0000000054', 3),
(144, '978-0000000055', 1),
(145, '978-0000000056', 4),
(145, '978-0000000057', 2),
(146, '978-0000000058', 2),
(147, '978-0000000059', 3),
(147, '978-0000000060', 1),
(148, '978-0000000061', 2),
(149, '978-0000000062', 5),
(149, '978-0000000063', 2),
(150, '978-0000000064', 3);

-- =====================================================
-- 10. Sample Actions (audit log) - 20 entries
-- =====================================================
INSERT INTO action (Username, ISBN, UpdateTimestamp, Notes) VALUES
('admin', '978-1501142970', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Stock updated'),
('admin', '978-0439708180', DATE_SUB(NOW(), INTERVAL 2 DAY), 'Price adjusted'),
('admin', '978-0385504201', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Category changed'),
('admin', '978-0316017930', DATE_SUB(NOW(), INTERVAL 4 DAY), 'Threshold modified'),
('admin', '978-0062316110', DATE_SUB(NOW(), INTERVAL 5 DAY), 'New book added'),
('admin', '978-1524763138', DATE_SUB(NOW(), INTERVAL 6 DAY), 'Stock replenishment'),
('admin', '978-0735211292', DATE_SUB(NOW(), INTERVAL 7 DAY), 'Publisher updated'),
('admin', '978-0345539434', DATE_SUB(NOW(), INTERVAL 8 DAY), 'Author corrected'),
('admin', '978-0393355673', DATE_SUB(NOW(), INTERVAL 9 DAY), 'Price reduction'),
('admin', '978-0767908184', DATE_SUB(NOW(), INTERVAL 10 DAY), 'New arrival'),
('admin', '978-0000000011', DATE_SUB(NOW(), INTERVAL 11 DAY), 'Category reassigned'),
('admin', '978-0000000012', DATE_SUB(NOW(), INTERVAL 12 DAY), 'Stock verified'),
('admin', '978-0000000013', DATE_SUB(NOW(), INTERVAL 13 DAY), 'Description updated'),
('admin', '978-0000000014', DATE_SUB(NOW(), INTERVAL 14 DAY), 'Threshold increased'),
('admin', '978-0000000015', DATE_SUB(NOW(), INTERVAL 15 DAY), 'Price increase'),
('admin', '978-0000000016', DATE_SUB(NOW(), INTERVAL 16 DAY), 'Featured selection'),
('admin', '978-0000000017', DATE_SUB(NOW(), INTERVAL 17 DAY), 'Inventory audit'),
('admin', '978-0000000018', DATE_SUB(NOW(), INTERVAL 18 DAY), 'Quality check'),
('admin', '978-0000000019', DATE_SUB(NOW(), INTERVAL 19 DAY), 'Restocked'),
('admin', '978-0000000020', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Stock updated'),
('admin', '978-0000000021', DATE_SUB(NOW(), INTERVAL 21 DAY), 'Price adjusted'),
('admin', '978-0000000022', DATE_SUB(NOW(), INTERVAL 22 DAY), 'Category changed'),
('admin', '978-0000000023', DATE_SUB(NOW(), INTERVAL 23 DAY), 'Threshold modified'),
('admin', '978-0000000024', DATE_SUB(NOW(), INTERVAL 24 DAY), 'New book added'),
('admin', '978-0000000025', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Stock replenishment'),
('admin', '978-0000000026', DATE_SUB(NOW(), INTERVAL 26 DAY), 'Publisher updated'),
('admin', '978-0000000027', DATE_SUB(NOW(), INTERVAL 27 DAY), 'Author corrected'),
('admin', '978-0000000028', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Price reduction'),
('admin', '978-0000000029', DATE_SUB(NOW(), INTERVAL 29 DAY), 'New arrival'),
('admin', '978-0000000030', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Category reassigned'),
('admin', '978-0000000031', DATE_SUB(NOW(), INTERVAL 31 DAY), 'Stock verified'),
('admin', '978-0000000032', DATE_SUB(NOW(), INTERVAL 32 DAY), 'Description updated'),
('admin', '978-0000000033', DATE_SUB(NOW(), INTERVAL 33 DAY), 'Threshold increased'),
('admin', '978-0000000034', DATE_SUB(NOW(), INTERVAL 34 DAY), 'Price increase'),
('admin', '978-0000000035', DATE_SUB(NOW(), INTERVAL 35 DAY), 'Featured selection'),
('admin', '978-0000000036', DATE_SUB(NOW(), INTERVAL 36 DAY), 'Inventory audit'),
('admin', '978-0000000037', DATE_SUB(NOW(), INTERVAL 37 DAY), 'Quality check'),
('admin', '978-0000000038', DATE_SUB(NOW(), INTERVAL 38 DAY), 'Restocked'),
('admin', '978-0000000039', DATE_SUB(NOW(), INTERVAL 39 DAY), 'Stock updated'),
('admin', '978-0000000040', DATE_SUB(NOW(), INTERVAL 40 DAY), 'Price adjusted'),
('admin', '978-0000000041', DATE_SUB(NOW(), INTERVAL 41 DAY), 'Category changed'),
('admin', '978-0000000042', DATE_SUB(NOW(), INTERVAL 42 DAY), 'Threshold modified'),
('admin', '978-0000000043', DATE_SUB(NOW(), INTERVAL 43 DAY), 'New book added'),
('admin', '978-0000000044', DATE_SUB(NOW(), INTERVAL 44 DAY), 'Stock replenishment'),
('admin', '978-0000000045', DATE_SUB(NOW(), INTERVAL 45 DAY), 'Publisher updated'),
('admin', '978-0000000046', DATE_SUB(NOW(), INTERVAL 46 DAY), 'Author corrected'),
('admin', '978-0000000047', DATE_SUB(NOW(), INTERVAL 47 DAY), 'Price reduction'),
('admin', '978-0000000048', DATE_SUB(NOW(), INTERVAL 48 DAY), 'New arrival'),
('admin', '978-0000000049', DATE_SUB(NOW(), INTERVAL 49 DAY), 'Category reassigned'),
('admin', '978-0000000050', DATE_SUB(NOW(), INTERVAL 50 DAY), 'Stock verified'),
('admin', '978-0000000051', DATE_SUB(NOW(), INTERVAL 51 DAY), 'Description updated'),
('admin', '978-0000000052', DATE_SUB(NOW(), INTERVAL 52 DAY), 'Threshold increased'),
('admin', '978-0000000053', DATE_SUB(NOW(), INTERVAL 53 DAY), 'Price increase'),
('admin', '978-0000000054', DATE_SUB(NOW(), INTERVAL 54 DAY), 'Featured selection'),
('admin', '978-0000000055', DATE_SUB(NOW(), INTERVAL 55 DAY), 'Inventory audit'),
('admin', '978-0000000056', DATE_SUB(NOW(), INTERVAL 56 DAY), 'Quality check'),
('admin', '978-0000000057', DATE_SUB(NOW(), INTERVAL 57 DAY), 'Restocked'),
('admin', '978-0000000058', DATE_SUB(NOW(), INTERVAL 58 DAY), 'Stock updated'),
('admin', '978-0000000059', DATE_SUB(NOW(), INTERVAL 59 DAY), 'Price adjusted'),
('admin', '978-0000000060', DATE_SUB(NOW(), INTERVAL 60 DAY), 'Category changed'),
('admin', '978-0000000061', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Threshold modified'),
('admin', '978-0000000062', DATE_SUB(NOW(), INTERVAL 2 DAY), 'New book added'),
('admin', '978-0000000063', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Stock replenishment'),
('admin', '978-0000000064', DATE_SUB(NOW(), INTERVAL 4 DAY), 'Publisher updated'),
('admin', '978-0000000065', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Author corrected'),
('admin', '978-0000000066', DATE_SUB(NOW(), INTERVAL 6 DAY), 'Price reduction'),
('admin', '978-0000000067', DATE_SUB(NOW(), INTERVAL 7 DAY), 'New arrival'),
('admin', '978-0000000068', DATE_SUB(NOW(), INTERVAL 8 DAY), 'Category reassigned'),
('admin', '978-0000000069', DATE_SUB(NOW(), INTERVAL 9 DAY), 'Stock verified'),
('admin', '978-0000000070', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Description updated'),
('admin', '978-0000000071', DATE_SUB(NOW(), INTERVAL 11 DAY), 'Threshold increased'),
('admin', '978-0000000072', DATE_SUB(NOW(), INTERVAL 12 DAY), 'Price increase'),
('admin', '978-0000000073', DATE_SUB(NOW(), INTERVAL 13 DAY), 'Featured selection'),
('admin', '978-0000000074', DATE_SUB(NOW(), INTERVAL 14 DAY), 'Inventory audit'),
('admin', '978-0000000075', DATE_SUB(NOW(), INTERVAL 15 DAY), 'Quality check'),
('admin', '978-0000000076', DATE_SUB(NOW(), INTERVAL 16 DAY), 'Restocked'),
('admin', '978-0000000077', DATE_SUB(NOW(), INTERVAL 17 DAY), 'Stock updated'),
('admin', '978-0000000078', DATE_SUB(NOW(), INTERVAL 18 DAY), 'Price adjusted'),
('admin', '978-0000000079', DATE_SUB(NOW(), INTERVAL 19 DAY), 'Category changed'),
('admin', '978-0000000080', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Threshold modified'),
('admin', '978-0000000081', DATE_SUB(NOW(), INTERVAL 21 DAY), 'New book added'),
('admin', '978-0000000082', DATE_SUB(NOW(), INTERVAL 22 DAY), 'Stock replenishment'),
('admin', '978-0000000083', DATE_SUB(NOW(), INTERVAL 23 DAY), 'Publisher updated'),
('admin', '978-0000000084', DATE_SUB(NOW(), INTERVAL 24 DAY), 'Author corrected'),
('admin', '978-0000000085', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Price reduction'),
('admin', '978-0000000086', DATE_SUB(NOW(), INTERVAL 26 DAY), 'New arrival'),
('admin', '978-0000000087', DATE_SUB(NOW(), INTERVAL 27 DAY), 'Category reassigned'),
('admin', '978-0000000088', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Stock verified'),
('admin', '978-0000000089', DATE_SUB(NOW(), INTERVAL 29 DAY), 'Description updated'),
('admin', '978-0000000090', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Threshold increased'),
('admin', '978-0000000091', DATE_SUB(NOW(), INTERVAL 31 DAY), 'Price increase'),
('admin', '978-0000000092', DATE_SUB(NOW(), INTERVAL 32 DAY), 'Featured selection'),
('admin', '978-0000000093', DATE_SUB(NOW(), INTERVAL 33 DAY), 'Inventory audit'),
('admin', '978-0000000094', DATE_SUB(NOW(), INTERVAL 34 DAY), 'Quality check'),
('admin', '978-0000000095', DATE_SUB(NOW(), INTERVAL 35 DAY), 'Restocked'),
('admin', '978-0000000096', DATE_SUB(NOW(), INTERVAL 36 DAY), 'Stock updated'),
('admin', '978-0000000097', DATE_SUB(NOW(), INTERVAL 37 DAY), 'Price adjusted'),
('admin', '978-0000000098', DATE_SUB(NOW(), INTERVAL 38 DAY), 'Category changed'),
('admin', '978-0000000099', DATE_SUB(NOW(), INTERVAL 39 DAY), 'Threshold modified'),
('admin', '978-0000000100', DATE_SUB(NOW(), INTERVAL 40 DAY), 'New book added'),
('admin', '978-0000000101', DATE_SUB(NOW(), INTERVAL 41 DAY), 'Stock replenishment'),
('admin', '978-0000000102', DATE_SUB(NOW(), INTERVAL 42 DAY), 'Publisher updated'),
('admin', '978-0000000103', DATE_SUB(NOW(), INTERVAL 43 DAY), 'Author corrected'),
('admin', '978-0000000104', DATE_SUB(NOW(), INTERVAL 44 DAY), 'Price reduction'),
('admin', '978-0000000105', DATE_SUB(NOW(), INTERVAL 45 DAY), 'New arrival'),
('admin', '978-0000000106', DATE_SUB(NOW(), INTERVAL 46 DAY), 'Category reassigned'),
('admin', '978-0000000107', DATE_SUB(NOW(), INTERVAL 47 DAY), 'Stock verified'),
('admin', '978-0000000108', DATE_SUB(NOW(), INTERVAL 48 DAY), 'Description updated'),
('admin', '978-0000000109', DATE_SUB(NOW(), INTERVAL 49 DAY), 'Threshold increased'),
('admin', '978-0000000110', DATE_SUB(NOW(), INTERVAL 50 DAY), 'Price increase'),
('admin', '978-0000000111', DATE_SUB(NOW(), INTERVAL 51 DAY), 'Featured selection'),
('admin', '978-0000000112', DATE_SUB(NOW(), INTERVAL 52 DAY), 'Inventory audit'),
('admin', '978-0000000113', DATE_SUB(NOW(), INTERVAL 53 DAY), 'Quality check'),
('admin', '978-0000000114', DATE_SUB(NOW(), INTERVAL 54 DAY), 'Restocked'),
('admin', '978-0000000115', DATE_SUB(NOW(), INTERVAL 55 DAY), 'Stock updated'),
('admin', '978-0000000116', DATE_SUB(NOW(), INTERVAL 56 DAY), 'Price adjusted'),
('admin', '978-0000000117', DATE_SUB(NOW(), INTERVAL 57 DAY), 'Category changed'),
('admin', '978-0000000118', DATE_SUB(NOW(), INTERVAL 58 DAY), 'Threshold modified'),
('admin', '978-0000000119', DATE_SUB(NOW(), INTERVAL 59 DAY), 'New book added'),
('admin', '978-0000000120', DATE_SUB(NOW(), INTERVAL 60 DAY), 'Stock replenishment'),
('admin', '978-0000000121', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Publisher updated'),
('admin', '978-0000000122', DATE_SUB(NOW(), INTERVAL 2 DAY), 'Author corrected'),
('admin', '978-0000000123', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Price reduction'),
('admin', '978-0000000124', DATE_SUB(NOW(), INTERVAL 4 DAY), 'New arrival'),
('admin', '978-0000000125', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Category reassigned'),
('admin', '978-0000000126', DATE_SUB(NOW(), INTERVAL 6 DAY), 'Stock verified'),
('admin', '978-0000000127', DATE_SUB(NOW(), INTERVAL 7 DAY), 'Description updated'),
('admin', '978-0000000128', DATE_SUB(NOW(), INTERVAL 8 DAY), 'Threshold increased'),
('admin', '978-0000000129', DATE_SUB(NOW(), INTERVAL 9 DAY), 'Price increase'),
('admin', '978-0000000130', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Featured selection'),
('admin', '978-0000000131', DATE_SUB(NOW(), INTERVAL 11 DAY), 'Inventory audit'),
('admin', '978-0000000132', DATE_SUB(NOW(), INTERVAL 12 DAY), 'Quality check'),
('admin', '978-0000000133', DATE_SUB(NOW(), INTERVAL 13 DAY), 'Restocked'),
('admin', '978-0000000134', DATE_SUB(NOW(), INTERVAL 14 DAY), 'Stock updated'),
('admin', '978-0000000135', DATE_SUB(NOW(), INTERVAL 15 DAY), 'Price adjusted'),
('admin', '978-0000000136', DATE_SUB(NOW(), INTERVAL 16 DAY), 'Category changed'),
('admin', '978-0000000137', DATE_SUB(NOW(), INTERVAL 17 DAY), 'Threshold modified'),
('admin', '978-0000000138', DATE_SUB(NOW(), INTERVAL 18 DAY), 'New book added'),
('admin', '978-0000000139', DATE_SUB(NOW(), INTERVAL 19 DAY), 'Stock replenishment'),
('admin', '978-0000000140', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Publisher updated'),
('admin', '978-0000000141', DATE_SUB(NOW(), INTERVAL 21 DAY), 'Author corrected'),
('admin', '978-0000000142', DATE_SUB(NOW(), INTERVAL 22 DAY), 'Price reduction'),
('admin', '978-0000000143', DATE_SUB(NOW(), INTERVAL 23 DAY), 'New arrival'),
('admin', '978-0000000144', DATE_SUB(NOW(), INTERVAL 24 DAY), 'Category reassigned'),
('admin', '978-0000000145', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Stock verified'),
('admin', '978-0000000146', DATE_SUB(NOW(), INTERVAL 26 DAY), 'Description updated'),
('admin', '978-0000000147', DATE_SUB(NOW(), INTERVAL 27 DAY), 'Threshold increased'),
('admin', '978-0000000148', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Price increase'),
('admin', '978-0000000149', DATE_SUB(NOW(), INTERVAL 29 DAY), 'Featured selection'),
('admin', '978-0000000150', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Inventory audit');

-- =====================================================
-- 11. Sample Supply Orders (Reorders) - Confirmed and Cancelled
-- =====================================================
INSERT INTO SupplyOrder (Username, PublisherID, OrderDate, Status, TotalPrice, DecisionBy) VALUES
('admin', 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Confirmed', 250.00, 'admin'),
('admin', 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Confirmed', 180.50, 'admin'),
('admin', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Cancelled', 320.00, 'admin'),
('admin', 4, DATE_SUB(NOW(), INTERVAL 4 DAY), 'Confirmed', 145.75, 'admin'),
('admin', 5, DATE_SUB(NOW(), INTERVAL 5 DAY), 'Confirmed', 290.00, 'admin'),
('admin', 6, DATE_SUB(NOW(), INTERVAL 6 DAY), 'Cancelled', 175.25, 'admin'),
('admin', 7, DATE_SUB(NOW(), INTERVAL 7 DAY), 'Confirmed', 420.00, 'admin'),
('admin', 8, DATE_SUB(NOW(), INTERVAL 8 DAY), 'Confirmed', 95.50, 'admin'),
('admin', 9, DATE_SUB(NOW(), INTERVAL 9 DAY), 'Confirmed', 310.00, 'admin'),
('admin', 10, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Pending', 225.75, NULL),
('admin', 11, DATE_SUB(NOW(), INTERVAL 11 DAY), 'Confirmed', 380.00, 'admin'),
('admin', 12, DATE_SUB(NOW(), INTERVAL 12 DAY), 'Confirmed', 195.50, 'admin'),
('admin', 13, DATE_SUB(NOW(), INTERVAL 13 DAY), 'Confirmed', 275.00, 'admin'),
('admin', 14, DATE_SUB(NOW(), INTERVAL 14 DAY), 'Cancelled', 160.75, 'admin'),
('admin', 15, DATE_SUB(NOW(), INTERVAL 15 DAY), 'Confirmed', 340.00, 'admin'),
('admin', 16, DATE_SUB(NOW(), INTERVAL 16 DAY), 'Confirmed', 215.25, 'admin'),
('admin', 17, DATE_SUB(NOW(), INTERVAL 17 DAY), 'Confirmed', 485.00, 'admin'),
('admin', 18, DATE_SUB(NOW(), INTERVAL 18 DAY), 'Pending', 125.50, NULL),
('admin', 19, DATE_SUB(NOW(), INTERVAL 19 DAY), 'Confirmed', 365.00, 'admin'),
('admin', 20, DATE_SUB(NOW(), INTERVAL 20 DAY), 'Confirmed', 245.75, 'admin'),
('admin', 21, DATE_SUB(NOW(), INTERVAL 21 DAY), 'Confirmed', 410.00, 'admin'),
('admin', 22, DATE_SUB(NOW(), INTERVAL 22 DAY), 'Cancelled', 190.50, 'admin'),
('admin', 23, DATE_SUB(NOW(), INTERVAL 23 DAY), 'Confirmed', 295.00, 'admin'),
('admin', 24, DATE_SUB(NOW(), INTERVAL 24 DAY), 'Confirmed', 175.75, 'admin'),
('admin', 25, DATE_SUB(NOW(), INTERVAL 25 DAY), 'Confirmed', 355.00, 'admin'),
('admin', 26, DATE_SUB(NOW(), INTERVAL 26 DAY), 'Confirmed', 230.25, 'admin'),
('admin', 27, DATE_SUB(NOW(), INTERVAL 27 DAY), 'Confirmed', 500.00, 'admin'),
('admin', 28, DATE_SUB(NOW(), INTERVAL 28 DAY), 'Confirmed', 140.50, 'admin'),
('admin', 29, DATE_SUB(NOW(), INTERVAL 29 DAY), 'Pending', 385.00, NULL),
('admin', 30, DATE_SUB(NOW(), INTERVAL 30 DAY), 'Confirmed', 260.75, 'admin'),
('admin', 31, DATE_SUB(NOW(), INTERVAL 31 DAY), 'Confirmed', 425.00, 'admin'),
('admin', 32, DATE_SUB(NOW(), INTERVAL 32 DAY), 'Confirmed', 205.50, 'admin'),
('admin', 33, DATE_SUB(NOW(), INTERVAL 33 DAY), 'Cancelled', 310.00, 'admin'),
('admin', 34, DATE_SUB(NOW(), INTERVAL 34 DAY), 'Confirmed', 190.75, 'admin'),
('admin', 35, DATE_SUB(NOW(), INTERVAL 35 DAY), 'Confirmed', 370.00, 'admin'),
('admin', 36, DATE_SUB(NOW(), INTERVAL 36 DAY), 'Confirmed', 245.25, 'admin'),
('admin', 37, DATE_SUB(NOW(), INTERVAL 37 DAY), 'Confirmed', 515.00, 'admin'),
('admin', 38, DATE_SUB(NOW(), INTERVAL 38 DAY), 'Confirmed', 155.50, 'admin'),
('admin', 39, DATE_SUB(NOW(), INTERVAL 39 DAY), 'Confirmed', 400.00, 'admin'),
('admin', 40, DATE_SUB(NOW(), INTERVAL 40 DAY), 'Pending', 275.75, NULL),
('admin', 41, DATE_SUB(NOW(), INTERVAL 41 DAY), 'Confirmed', 440.00, 'admin'),
('admin', 42, DATE_SUB(NOW(), INTERVAL 42 DAY), 'Confirmed', 220.50, 'admin'),
('admin', 43, DATE_SUB(NOW(), INTERVAL 43 DAY), 'Confirmed', 325.00, 'admin'),
('admin', 44, DATE_SUB(NOW(), INTERVAL 44 DAY), 'Cancelled', 205.75, 'admin'),
('admin', 45, DATE_SUB(NOW(), INTERVAL 45 DAY), 'Confirmed', 385.00, 'admin'),
('admin', 46, DATE_SUB(NOW(), INTERVAL 46 DAY), 'Confirmed', 260.25, 'admin'),
('admin', 47, DATE_SUB(NOW(), INTERVAL 47 DAY), 'Confirmed', 530.00, 'admin'),
('admin', 48, DATE_SUB(NOW(), INTERVAL 48 DAY), 'Confirmed', 170.50, 'admin'),
('admin', 49, DATE_SUB(NOW(), INTERVAL 49 DAY), 'Confirmed', 415.00, 'admin'),
('admin', 50, DATE_SUB(NOW(), INTERVAL 50 DAY), 'Confirmed', 290.75, 'admin'),
('admin', 51, DATE_SUB(NOW(), INTERVAL 51 DAY), 'Pending', 455.00, NULL),
('admin', 52, DATE_SUB(NOW(), INTERVAL 52 DAY), 'Confirmed', 235.50, 'admin'),
('admin', 53, DATE_SUB(NOW(), INTERVAL 53 DAY), 'Confirmed', 340.00, 'admin'),
('admin', 54, DATE_SUB(NOW(), INTERVAL 54 DAY), 'Confirmed', 220.75, 'admin'),
('admin', 55, DATE_SUB(NOW(), INTERVAL 55 DAY), 'Cancelled', 400.00, 'admin'),
('admin', 56, DATE_SUB(NOW(), INTERVAL 56 DAY), 'Confirmed', 275.25, 'admin'),
('admin', 57, DATE_SUB(NOW(), INTERVAL 57 DAY), 'Confirmed', 545.00, 'admin'),
('admin', 58, DATE_SUB(NOW(), INTERVAL 58 DAY), 'Confirmed', 185.50, 'admin'),
('admin', 59, DATE_SUB(NOW(), INTERVAL 59 DAY), 'Confirmed', 430.00, 'admin'),
('admin', 60, DATE_SUB(NOW(), INTERVAL 60 DAY), 'Confirmed', 305.75, 'admin'),
('admin', 61, DATE_SUB(NOW(), INTERVAL 61 DAY), 'Confirmed', 470.00, 'admin'),
('admin', 62, DATE_SUB(NOW(), INTERVAL 62 DAY), 'Pending', 250.50, NULL),
('admin', 63, DATE_SUB(NOW(), INTERVAL 63 DAY), 'Confirmed', 355.00, 'admin'),
('admin', 64, DATE_SUB(NOW(), INTERVAL 64 DAY), 'Confirmed', 235.75, 'admin'),
('admin', 65, DATE_SUB(NOW(), INTERVAL 65 DAY), 'Confirmed', 415.00, 'admin'),
('admin', 66, DATE_SUB(NOW(), INTERVAL 66 DAY), 'Cancelled', 290.25, 'admin'),
('admin', 67, DATE_SUB(NOW(), INTERVAL 67 DAY), 'Confirmed', 560.00, 'admin'),
('admin', 68, DATE_SUB(NOW(), INTERVAL 68 DAY), 'Confirmed', 200.50, 'admin'),
('admin', 69, DATE_SUB(NOW(), INTERVAL 69 DAY), 'Confirmed', 445.00, 'admin'),
('admin', 70, DATE_SUB(NOW(), INTERVAL 70 DAY), 'Confirmed', 320.75, 'admin'),
('admin', 71, DATE_SUB(NOW(), INTERVAL 71 DAY), 'Confirmed', 485.00, 'admin'),
('admin', 72, DATE_SUB(NOW(), INTERVAL 72 DAY), 'Confirmed', 265.50, 'admin'),
('admin', 73, DATE_SUB(NOW(), INTERVAL 73 DAY), 'Pending', 370.00, NULL),
('admin', 74, DATE_SUB(NOW(), INTERVAL 74 DAY), 'Confirmed', 250.75, 'admin'),
('admin', 75, DATE_SUB(NOW(), INTERVAL 75 DAY), 'Confirmed', 430.00, 'admin'),
('admin', 76, DATE_SUB(NOW(), INTERVAL 76 DAY), 'Confirmed', 305.25, 'admin'),
('admin', 77, DATE_SUB(NOW(), INTERVAL 77 DAY), 'Cancelled', 575.00, 'admin'),
('admin', 78, DATE_SUB(NOW(), INTERVAL 78 DAY), 'Confirmed', 215.50, 'admin'),
('admin', 79, DATE_SUB(NOW(), INTERVAL 79 DAY), 'Confirmed', 460.00, 'admin'),
('admin', 80, DATE_SUB(NOW(), INTERVAL 80 DAY), 'Confirmed', 335.75, 'admin'),
('admin', 81, DATE_SUB(NOW(), INTERVAL 81 DAY), 'Confirmed', 500.00, 'admin'),
('admin', 82, DATE_SUB(NOW(), INTERVAL 82 DAY), 'Confirmed', 280.50, 'admin'),
('admin', 83, DATE_SUB(NOW(), INTERVAL 83 DAY), 'Confirmed', 385.00, 'admin'),
('admin', 84, DATE_SUB(NOW(), INTERVAL 84 DAY), 'Pending', 265.75, NULL),
('admin', 85, DATE_SUB(NOW(), INTERVAL 85 DAY), 'Confirmed', 445.00, 'admin'),
('admin', 86, DATE_SUB(NOW(), INTERVAL 86 DAY), 'Confirmed', 320.25, 'admin'),
('admin', 87, DATE_SUB(NOW(), INTERVAL 87 DAY), 'Cancelled', 590.00, 'admin'),
('admin', 88, DATE_SUB(NOW(), INTERVAL 88 DAY), 'Confirmed', 230.50, 'admin'),
('admin', 89, DATE_SUB(NOW(), INTERVAL 89 DAY), 'Confirmed', 475.00, 'admin'),
('admin', 90, DATE_SUB(NOW(), INTERVAL 90 DAY), 'Confirmed', 350.75, 'admin'),
('admin', 91, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Confirmed', 515.00, 'admin'),
('admin', 92, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Confirmed', 295.50, 'admin'),
('admin', 93, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Confirmed', 400.00, 'admin'),
('admin', 94, DATE_SUB(NOW(), INTERVAL 4 DAY), 'Confirmed', 280.75, 'admin'),
('admin', 95, DATE_SUB(NOW(), INTERVAL 5 DAY), 'Pending', 460.00, NULL),
('admin', 96, DATE_SUB(NOW(), INTERVAL 6 DAY), 'Confirmed', 335.25, 'admin'),
('admin', 97, DATE_SUB(NOW(), INTERVAL 7 DAY), 'Confirmed', 605.00, 'admin'),
('admin', 98, DATE_SUB(NOW(), INTERVAL 8 DAY), 'Cancelled', 245.50, 'admin'),
('admin', 99, DATE_SUB(NOW(), INTERVAL 9 DAY), 'Confirmed', 490.00, 'admin'),
('admin', 100, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Confirmed', 365.75, 'admin'),
('admin', 101, DATE_SUB(NOW(), INTERVAL 11 DAY), 'Confirmed', 530.00, 'admin'),
('admin', 102, DATE_SUB(NOW(), INTERVAL 12 DAY), 'Confirmed', 310.50, 'admin'),
('admin', 103, DATE_SUB(NOW(), INTERVAL 13 DAY), 'Confirmed', 415.00, 'admin'),
('admin', 104, DATE_SUB(NOW(), INTERVAL 14 DAY), 'Confirmed', 295.75, 'admin'),
('admin', 105, DATE_SUB(NOW(), INTERVAL 15 DAY), 'Confirmed', 475.00, 'admin'),
('admin', 106, DATE_SUB(NOW(), INTERVAL 16 DAY), 'Pending', 350.25, NULL),
('admin', 107, DATE_SUB(NOW(), INTERVAL 17 DAY), 'Confirmed', 620.00, 'admin'),
('admin', 108, DATE_SUB(NOW(), INTERVAL 18 DAY), 'Confirmed', 260.50, 'admin'),
('admin', 109, DATE_SUB(NOW(), INTERVAL 19 DAY), 'Cancelled', 505.00, 'admin'),
('admin', 110, DATE_SUB(NOW(), INTERVAL 20 DAY), 'Confirmed', 380.75, 'admin'),
('admin', 111, DATE_SUB(NOW(), INTERVAL 21 DAY), 'Confirmed', 545.00, 'admin'),
('admin', 112, DATE_SUB(NOW(), INTERVAL 22 DAY), 'Confirmed', 325.50, 'admin'),
('admin', 113, DATE_SUB(NOW(), INTERVAL 23 DAY), 'Confirmed', 430.00, 'admin'),
('admin', 114, DATE_SUB(NOW(), INTERVAL 24 DAY), 'Confirmed', 310.75, 'admin'),
('admin', 115, DATE_SUB(NOW(), INTERVAL 25 DAY), 'Confirmed', 490.00, 'admin'),
('admin', 116, DATE_SUB(NOW(), INTERVAL 26 DAY), 'Confirmed', 365.25, 'admin'),
('admin', 117, DATE_SUB(NOW(), INTERVAL 27 DAY), 'Pending', 635.00, NULL),
('admin', 118, DATE_SUB(NOW(), INTERVAL 28 DAY), 'Confirmed', 275.50, 'admin'),
('admin', 119, DATE_SUB(NOW(), INTERVAL 29 DAY), 'Confirmed', 520.00, 'admin'),
('admin', 120, DATE_SUB(NOW(), INTERVAL 30 DAY), 'Cancelled', 395.75, 'admin'),
('admin', 121, DATE_SUB(NOW(), INTERVAL 31 DAY), 'Confirmed', 560.00, 'admin'),
('admin', 122, DATE_SUB(NOW(), INTERVAL 32 DAY), 'Confirmed', 340.50, 'admin'),
('admin', 123, DATE_SUB(NOW(), INTERVAL 33 DAY), 'Confirmed', 445.00, 'admin'),
('admin', 124, DATE_SUB(NOW(), INTERVAL 34 DAY), 'Confirmed', 325.75, 'admin'),
('admin', 125, DATE_SUB(NOW(), INTERVAL 35 DAY), 'Confirmed', 505.00, 'admin'),
('admin', 126, DATE_SUB(NOW(), INTERVAL 36 DAY), 'Confirmed', 380.25, 'admin'),
('admin', 127, DATE_SUB(NOW(), INTERVAL 37 DAY), 'Confirmed', 650.00, 'admin'),
('admin', 128, DATE_SUB(NOW(), INTERVAL 38 DAY), 'Pending', 290.50, NULL),
('admin', 129, DATE_SUB(NOW(), INTERVAL 39 DAY), 'Confirmed', 535.00, 'admin'),
('admin', 130, DATE_SUB(NOW(), INTERVAL 40 DAY), 'Confirmed', 410.75, 'admin'),
('admin', 131, DATE_SUB(NOW(), INTERVAL 41 DAY), 'Confirmed', 575.00, 'admin'),
('admin', 132, DATE_SUB(NOW(), INTERVAL 42 DAY), 'Cancelled', 355.50, 'admin'),
('admin', 133, DATE_SUB(NOW(), INTERVAL 43 DAY), 'Confirmed', 460.00, 'admin'),
('admin', 134, DATE_SUB(NOW(), INTERVAL 44 DAY), 'Confirmed', 340.75, 'admin'),
('admin', 135, DATE_SUB(NOW(), INTERVAL 45 DAY), 'Confirmed', 520.00, 'admin'),
('admin', 136, DATE_SUB(NOW(), INTERVAL 46 DAY), 'Confirmed', 395.25, 'admin'),
('admin', 137, DATE_SUB(NOW(), INTERVAL 47 DAY), 'Confirmed', 665.00, 'admin'),
('admin', 138, DATE_SUB(NOW(), INTERVAL 48 DAY), 'Confirmed', 305.50, 'admin'),
('admin', 139, DATE_SUB(NOW(), INTERVAL 49 DAY), 'Pending', 550.00, NULL),
('admin', 140, DATE_SUB(NOW(), INTERVAL 50 DAY), 'Confirmed', 425.75, 'admin'),
('admin', 141, DATE_SUB(NOW(), INTERVAL 51 DAY), 'Confirmed', 590.00, 'admin'),
('admin', 142, DATE_SUB(NOW(), INTERVAL 52 DAY), 'Confirmed', 370.50, 'admin'),
('admin', 143, DATE_SUB(NOW(), INTERVAL 53 DAY), 'Confirmed', 475.00, 'admin'),
('admin', 144, DATE_SUB(NOW(), INTERVAL 54 DAY), 'Cancelled', 355.75, 'admin'),
('admin', 145, DATE_SUB(NOW(), INTERVAL 55 DAY), 'Confirmed', 535.00, 'admin'),
('admin', 146, DATE_SUB(NOW(), INTERVAL 56 DAY), 'Confirmed', 410.25, 'admin'),
('admin', 147, DATE_SUB(NOW(), INTERVAL 57 DAY), 'Confirmed', 680.00, 'admin'),
('admin', 148, DATE_SUB(NOW(), INTERVAL 58 DAY), 'Confirmed', 320.50, 'admin'),
('admin', 149, DATE_SUB(NOW(), INTERVAL 59 DAY), 'Confirmed', 565.00, 'admin'),
('admin', 150, DATE_SUB(NOW(), INTERVAL 60 DAY), 'Pending', 440.75, NULL);

-- =====================================================
-- 12. Sample Supply Order Items
-- =====================================================
INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 1, DATE_SUB(NOW(), INTERVAL 1 DAY), '978-1501142970', 20
UNION ALL SELECT 'admin', 2, DATE_SUB(NOW(), INTERVAL 2 DAY), '978-0439708180', 30
UNION ALL SELECT 'admin', 3, DATE_SUB(NOW(), INTERVAL 3 DAY), '978-0385504201', 25
UNION ALL SELECT 'admin', 4, DATE_SUB(NOW(), INTERVAL 4 DAY), '978-0316017930', 15
UNION ALL SELECT 'admin', 5, DATE_SUB(NOW(), INTERVAL 5 DAY), '978-0062316110', 20
UNION ALL SELECT 'admin', 6, DATE_SUB(NOW(), INTERVAL 6 DAY), '978-1524763138', 18
UNION ALL SELECT 'admin', 7, DATE_SUB(NOW(), INTERVAL 7 DAY), '978-0735211292', 35
UNION ALL SELECT 'admin', 8, DATE_SUB(NOW(), INTERVAL 8 DAY), '978-0345539434', 10
UNION ALL SELECT 'admin', 9, DATE_SUB(NOW(), INTERVAL 9 DAY), '978-0393355673', 22
UNION ALL SELECT 'admin', 10, DATE_SUB(NOW(), INTERVAL 10 DAY), '978-0767908184', 15
UNION ALL SELECT 'admin', 11, DATE_SUB(NOW(), INTERVAL 11 DAY), '978-0000000011', 25
UNION ALL SELECT 'admin', 12, DATE_SUB(NOW(), INTERVAL 12 DAY), '978-0000000012', 18
UNION ALL SELECT 'admin', 13, DATE_SUB(NOW(), INTERVAL 13 DAY), '978-0000000013', 20
UNION ALL SELECT 'admin', 14, DATE_SUB(NOW(), INTERVAL 14 DAY), '978-0000000014', 12
UNION ALL SELECT 'admin', 15, DATE_SUB(NOW(), INTERVAL 15 DAY), '978-0000000015', 28
UNION ALL SELECT 'admin', 16, DATE_SUB(NOW(), INTERVAL 16 DAY), '978-0000000016', 22
UNION ALL SELECT 'admin', 17, DATE_SUB(NOW(), INTERVAL 17 DAY), '978-0000000017', 35
UNION ALL SELECT 'admin', 18, DATE_SUB(NOW(), INTERVAL 18 DAY), '978-0000000018', 10
UNION ALL SELECT 'admin', 19, DATE_SUB(NOW(), INTERVAL 19 DAY), '978-0000000019', 26
UNION ALL SELECT 'admin', 20, DATE_SUB(NOW(), INTERVAL 20 DAY), '978-0000000020', 20
UNION ALL SELECT 'admin', 21, DATE_SUB(NOW(), INTERVAL 21 DAY), '978-0000000021', 30
UNION ALL SELECT 'admin', 22, DATE_SUB(NOW(), INTERVAL 22 DAY), '978-0000000022', 15
UNION ALL SELECT 'admin', 23, DATE_SUB(NOW(), INTERVAL 23 DAY), '978-0000000023', 22
UNION ALL SELECT 'admin', 24, DATE_SUB(NOW(), INTERVAL 24 DAY), '978-0000000024', 14
UNION ALL SELECT 'admin', 25, DATE_SUB(NOW(), INTERVAL 25 DAY), '978-0000000025', 28
UNION ALL SELECT 'admin', 26, DATE_SUB(NOW(), INTERVAL 26 DAY), '978-0000000026', 20
UNION ALL SELECT 'admin', 27, DATE_SUB(NOW(), INTERVAL 27 DAY), '978-0000000027', 38
UNION ALL SELECT 'admin', 28, DATE_SUB(NOW(), INTERVAL 28 DAY), '978-0000000028', 12
UNION ALL SELECT 'admin', 29, DATE_SUB(NOW(), INTERVAL 29 DAY), '978-0000000029', 30
UNION ALL SELECT 'admin', 30, DATE_SUB(NOW(), INTERVAL 30 DAY), '978-0000000030', 22
UNION ALL SELECT 'admin', 31, DATE_SUB(NOW(), INTERVAL 31 DAY), '978-0000000031', 32
UNION ALL SELECT 'admin', 32, DATE_SUB(NOW(), INTERVAL 32 DAY), '978-0000000032', 18
UNION ALL SELECT 'admin', 33, DATE_SUB(NOW(), INTERVAL 33 DAY), '978-0000000033', 24
UNION ALL SELECT 'admin', 34, DATE_SUB(NOW(), INTERVAL 34 DAY), '978-0000000034', 16
UNION ALL SELECT 'admin', 35, DATE_SUB(NOW(), INTERVAL 35 DAY), '978-0000000035', 30
UNION ALL SELECT 'admin', 36, DATE_SUB(NOW(), INTERVAL 36 DAY), '978-0000000036', 22
UNION ALL SELECT 'admin', 37, DATE_SUB(NOW(), INTERVAL 37 DAY), '978-0000000037', 40
UNION ALL SELECT 'admin', 38, DATE_SUB(NOW(), INTERVAL 38 DAY), '978-0000000038', 14
UNION ALL SELECT 'admin', 39, DATE_SUB(NOW(), INTERVAL 39 DAY), '978-0000000039', 32
UNION ALL SELECT 'admin', 40, DATE_SUB(NOW(), INTERVAL 40 DAY), '978-0000000040', 24
UNION ALL SELECT 'admin', 41, DATE_SUB(NOW(), INTERVAL 41 DAY), '978-0000000041', 35
UNION ALL SELECT 'admin', 42, DATE_SUB(NOW(), INTERVAL 42 DAY), '978-0000000042', 20
UNION ALL SELECT 'admin', 43, DATE_SUB(NOW(), INTERVAL 43 DAY), '978-0000000043', 26
UNION ALL SELECT 'admin', 44, DATE_SUB(NOW(), INTERVAL 44 DAY), '978-0000000044', 18
UNION ALL SELECT 'admin', 45, DATE_SUB(NOW(), INTERVAL 45 DAY), '978-0000000045', 32
UNION ALL SELECT 'admin', 46, DATE_SUB(NOW(), INTERVAL 46 DAY), '978-0000000046', 24
UNION ALL SELECT 'admin', 47, DATE_SUB(NOW(), INTERVAL 47 DAY), '978-0000000047', 42
UNION ALL SELECT 'admin', 48, DATE_SUB(NOW(), INTERVAL 48 DAY), '978-0000000048', 16
UNION ALL SELECT 'admin', 49, DATE_SUB(NOW(), INTERVAL 49 DAY), '978-0000000049', 34
UNION ALL SELECT 'admin', 50, DATE_SUB(NOW(), INTERVAL 50 DAY), '978-0000000050', 26
UNION ALL SELECT 'admin', 51, DATE_SUB(NOW(), INTERVAL 51 DAY), '978-0000000051', 38
UNION ALL SELECT 'admin', 52, DATE_SUB(NOW(), INTERVAL 52 DAY), '978-0000000052', 22
UNION ALL SELECT 'admin', 53, DATE_SUB(NOW(), INTERVAL 53 DAY), '978-0000000053', 28
UNION ALL SELECT 'admin', 54, DATE_SUB(NOW(), INTERVAL 54 DAY), '978-0000000054', 20
UNION ALL SELECT 'admin', 55, DATE_SUB(NOW(), INTERVAL 55 DAY), '978-0000000055', 34
UNION ALL SELECT 'admin', 56, DATE_SUB(NOW(), INTERVAL 56 DAY), '978-0000000056', 26
UNION ALL SELECT 'admin', 57, DATE_SUB(NOW(), INTERVAL 57 DAY), '978-0000000057', 44
UNION ALL SELECT 'admin', 58, DATE_SUB(NOW(), INTERVAL 58 DAY), '978-0000000058', 18
UNION ALL SELECT 'admin', 59, DATE_SUB(NOW(), INTERVAL 59 DAY), '978-0000000059', 36
UNION ALL SELECT 'admin', 60, DATE_SUB(NOW(), INTERVAL 60 DAY), '978-0000000060', 28
UNION ALL SELECT 'admin', 61, DATE_SUB(NOW(), INTERVAL 61 DAY), '978-0000000061', 40
UNION ALL SELECT 'admin', 62, DATE_SUB(NOW(), INTERVAL 62 DAY), '978-0000000062', 24
UNION ALL SELECT 'admin', 63, DATE_SUB(NOW(), INTERVAL 63 DAY), '978-0000000063', 30
UNION ALL SELECT 'admin', 64, DATE_SUB(NOW(), INTERVAL 64 DAY), '978-0000000064', 22
UNION ALL SELECT 'admin', 65, DATE_SUB(NOW(), INTERVAL 65 DAY), '978-0000000065', 36
UNION ALL SELECT 'admin', 66, DATE_SUB(NOW(), INTERVAL 66 DAY), '978-0000000066', 28
UNION ALL SELECT 'admin', 67, DATE_SUB(NOW(), INTERVAL 67 DAY), '978-0000000067', 46
UNION ALL SELECT 'admin', 68, DATE_SUB(NOW(), INTERVAL 68 DAY), '978-0000000068', 20
UNION ALL SELECT 'admin', 69, DATE_SUB(NOW(), INTERVAL 69 DAY), '978-0000000069', 38
UNION ALL SELECT 'admin', 70, DATE_SUB(NOW(), INTERVAL 70 DAY), '978-0000000070', 30
UNION ALL SELECT 'admin', 71, DATE_SUB(NOW(), INTERVAL 71 DAY), '978-0000000071', 42
UNION ALL SELECT 'admin', 72, DATE_SUB(NOW(), INTERVAL 72 DAY), '978-0000000072', 26
UNION ALL SELECT 'admin', 73, DATE_SUB(NOW(), INTERVAL 73 DAY), '978-0000000073', 32
UNION ALL SELECT 'admin', 74, DATE_SUB(NOW(), INTERVAL 74 DAY), '978-0000000074', 24
UNION ALL SELECT 'admin', 75, DATE_SUB(NOW(), INTERVAL 75 DAY), '978-0000000075', 38
UNION ALL SELECT 'admin', 76, DATE_SUB(NOW(), INTERVAL 76 DAY), '978-0000000076', 30
UNION ALL SELECT 'admin', 77, DATE_SUB(NOW(), INTERVAL 77 DAY), '978-0000000077', 48
UNION ALL SELECT 'admin', 78, DATE_SUB(NOW(), INTERVAL 78 DAY), '978-0000000078', 22
UNION ALL SELECT 'admin', 79, DATE_SUB(NOW(), INTERVAL 79 DAY), '978-0000000079', 40
UNION ALL SELECT 'admin', 80, DATE_SUB(NOW(), INTERVAL 80 DAY), '978-0000000080', 32
UNION ALL SELECT 'admin', 81, DATE_SUB(NOW(), INTERVAL 81 DAY), '978-0000000081', 44
UNION ALL SELECT 'admin', 82, DATE_SUB(NOW(), INTERVAL 82 DAY), '978-0000000082', 28
UNION ALL SELECT 'admin', 83, DATE_SUB(NOW(), INTERVAL 83 DAY), '978-0000000083', 34
UNION ALL SELECT 'admin', 84, DATE_SUB(NOW(), INTERVAL 84 DAY), '978-0000000084', 26
UNION ALL SELECT 'admin', 85, DATE_SUB(NOW(), INTERVAL 85 DAY), '978-0000000085', 40
UNION ALL SELECT 'admin', 86, DATE_SUB(NOW(), INTERVAL 86 DAY), '978-0000000086', 32
UNION ALL SELECT 'admin', 87, DATE_SUB(NOW(), INTERVAL 87 DAY), '978-0000000087', 50
UNION ALL SELECT 'admin', 88, DATE_SUB(NOW(), INTERVAL 88 DAY), '978-0000000088', 24
UNION ALL SELECT 'admin', 89, DATE_SUB(NOW(), INTERVAL 89 DAY), '978-0000000089', 42
UNION ALL SELECT 'admin', 90, DATE_SUB(NOW(), INTERVAL 90 DAY), '978-0000000090', 34
UNION ALL SELECT 'admin', 91, DATE_SUB(NOW(), INTERVAL 1 DAY), '978-0000000091', 46
UNION ALL SELECT 'admin', 92, DATE_SUB(NOW(), INTERVAL 2 DAY), '978-0000000092', 30
UNION ALL SELECT 'admin', 93, DATE_SUB(NOW(), INTERVAL 3 DAY), '978-0000000093', 36
UNION ALL SELECT 'admin', 94, DATE_SUB(NOW(), INTERVAL 4 DAY), '978-0000000094', 28
UNION ALL SELECT 'admin', 95, DATE_SUB(NOW(), INTERVAL 5 DAY), '978-0000000095', 42
UNION ALL SELECT 'admin', 96, DATE_SUB(NOW(), INTERVAL 6 DAY), '978-0000000096', 34
UNION ALL SELECT 'admin', 97, DATE_SUB(NOW(), INTERVAL 7 DAY), '978-0000000097', 50
UNION ALL SELECT 'admin', 98, DATE_SUB(NOW(), INTERVAL 8 DAY), '978-0000000098', 26
UNION ALL SELECT 'admin', 99, DATE_SUB(NOW(), INTERVAL 9 DAY), '978-0000000099', 44
UNION ALL SELECT 'admin', 100, DATE_SUB(NOW(), INTERVAL 10 DAY), '978-0000000100', 36
UNION ALL SELECT 'admin', 101, DATE_SUB(NOW(), INTERVAL 11 DAY), '978-0000000101', 48
UNION ALL SELECT 'admin', 102, DATE_SUB(NOW(), INTERVAL 12 DAY), '978-0000000102', 32
UNION ALL SELECT 'admin', 103, DATE_SUB(NOW(), INTERVAL 13 DAY), '978-0000000103', 38
UNION ALL SELECT 'admin', 104, DATE_SUB(NOW(), INTERVAL 14 DAY), '978-0000000104', 30
UNION ALL SELECT 'admin', 105, DATE_SUB(NOW(), INTERVAL 15 DAY), '978-0000000105', 44
UNION ALL SELECT 'admin', 106, DATE_SUB(NOW(), INTERVAL 16 DAY), '978-0000000106', 36
UNION ALL SELECT 'admin', 107, DATE_SUB(NOW(), INTERVAL 17 DAY), '978-0000000107', 50
UNION ALL SELECT 'admin', 108, DATE_SUB(NOW(), INTERVAL 18 DAY), '978-0000000108', 28
UNION ALL SELECT 'admin', 109, DATE_SUB(NOW(), INTERVAL 19 DAY), '978-0000000109', 46
UNION ALL SELECT 'admin', 110, DATE_SUB(NOW(), INTERVAL 20 DAY), '978-0000000110', 38
UNION ALL SELECT 'admin', 111, DATE_SUB(NOW(), INTERVAL 21 DAY), '978-0000000111', 48
UNION ALL SELECT 'admin', 112, DATE_SUB(NOW(), INTERVAL 22 DAY), '978-0000000112', 34
UNION ALL SELECT 'admin', 113, DATE_SUB(NOW(), INTERVAL 23 DAY), '978-0000000113', 40
UNION ALL SELECT 'admin', 114, DATE_SUB(NOW(), INTERVAL 24 DAY), '978-0000000114', 32
UNION ALL SELECT 'admin', 115, DATE_SUB(NOW(), INTERVAL 25 DAY), '978-0000000115', 46
UNION ALL SELECT 'admin', 116, DATE_SUB(NOW(), INTERVAL 26 DAY), '978-0000000116', 38
UNION ALL SELECT 'admin', 117, DATE_SUB(NOW(), INTERVAL 27 DAY), '978-0000000117', 50
UNION ALL SELECT 'admin', 118, DATE_SUB(NOW(), INTERVAL 28 DAY), '978-0000000118', 30
UNION ALL SELECT 'admin', 119, DATE_SUB(NOW(), INTERVAL 29 DAY), '978-0000000119', 48
UNION ALL SELECT 'admin', 120, DATE_SUB(NOW(), INTERVAL 30 DAY), '978-0000000120', 40
UNION ALL SELECT 'admin', 121, DATE_SUB(NOW(), INTERVAL 31 DAY), '978-0000000121', 48
UNION ALL SELECT 'admin', 122, DATE_SUB(NOW(), INTERVAL 32 DAY), '978-0000000122', 36
UNION ALL SELECT 'admin', 123, DATE_SUB(NOW(), INTERVAL 33 DAY), '978-0000000123', 42
UNION ALL SELECT 'admin', 124, DATE_SUB(NOW(), INTERVAL 34 DAY), '978-0000000124', 34
UNION ALL SELECT 'admin', 125, DATE_SUB(NOW(), INTERVAL 35 DAY), '978-0000000125', 48
UNION ALL SELECT 'admin', 126, DATE_SUB(NOW(), INTERVAL 36 DAY), '978-0000000126', 40
UNION ALL SELECT 'admin', 127, DATE_SUB(NOW(), INTERVAL 37 DAY), '978-0000000127', 50
UNION ALL SELECT 'admin', 128, DATE_SUB(NOW(), INTERVAL 38 DAY), '978-0000000128', 32
UNION ALL SELECT 'admin', 129, DATE_SUB(NOW(), INTERVAL 39 DAY), '978-0000000129', 50
UNION ALL SELECT 'admin', 130, DATE_SUB(NOW(), INTERVAL 40 DAY), '978-0000000130', 42
UNION ALL SELECT 'admin', 131, DATE_SUB(NOW(), INTERVAL 41 DAY), '978-0000000131', 48
UNION ALL SELECT 'admin', 132, DATE_SUB(NOW(), INTERVAL 42 DAY), '978-0000000132', 38
UNION ALL SELECT 'admin', 133, DATE_SUB(NOW(), INTERVAL 43 DAY), '978-0000000133', 44
UNION ALL SELECT 'admin', 134, DATE_SUB(NOW(), INTERVAL 44 DAY), '978-0000000134', 36
UNION ALL SELECT 'admin', 135, DATE_SUB(NOW(), INTERVAL 45 DAY), '978-0000000135', 50
UNION ALL SELECT 'admin', 136, DATE_SUB(NOW(), INTERVAL 46 DAY), '978-0000000136', 42
UNION ALL SELECT 'admin', 137, DATE_SUB(NOW(), INTERVAL 47 DAY), '978-0000000137', 50
UNION ALL SELECT 'admin', 138, DATE_SUB(NOW(), INTERVAL 48 DAY), '978-0000000138', 34
UNION ALL SELECT 'admin', 139, DATE_SUB(NOW(), INTERVAL 49 DAY), '978-0000000139', 50
UNION ALL SELECT 'admin', 140, DATE_SUB(NOW(), INTERVAL 50 DAY), '978-0000000140', 44
UNION ALL SELECT 'admin', 141, DATE_SUB(NOW(), INTERVAL 51 DAY), '978-0000000141', 50
UNION ALL SELECT 'admin', 142, DATE_SUB(NOW(), INTERVAL 52 DAY), '978-0000000142', 40
UNION ALL SELECT 'admin', 143, DATE_SUB(NOW(), INTERVAL 53 DAY), '978-0000000143', 46
UNION ALL SELECT 'admin', 144, DATE_SUB(NOW(), INTERVAL 54 DAY), '978-0000000144', 38
UNION ALL SELECT 'admin', 145, DATE_SUB(NOW(), INTERVAL 55 DAY), '978-0000000145', 50
UNION ALL SELECT 'admin', 146, DATE_SUB(NOW(), INTERVAL 56 DAY), '978-0000000146', 44
UNION ALL SELECT 'admin', 147, DATE_SUB(NOW(), INTERVAL 57 DAY), '978-0000000147', 50
UNION ALL SELECT 'admin', 148, DATE_SUB(NOW(), INTERVAL 58 DAY), '978-0000000148', 36
UNION ALL SELECT 'admin', 149, DATE_SUB(NOW(), INTERVAL 59 DAY), '978-0000000149', 50
UNION ALL SELECT 'admin', 150, DATE_SUB(NOW(), INTERVAL 60 DAY), '978-0000000150', 46;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;