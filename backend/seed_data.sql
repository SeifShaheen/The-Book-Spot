-- Seed Data for Bookstore System (150 records each)
-- Compatible with Node.js mysql2 driver (no DELIMITER/stored procedures)
SET FOREIGN_KEY_CHECKS = 0;
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
(DATE_SUB(NOW(), INTERVAL 5 DAY), 'Confirmed', 45.98, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 10 DAY), 'Confirmed', 27.00, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 15 DAY), 'Confirmed', 65.50, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 20 DAY), 'Confirmed', 89.99, 'johndoe'),
(DATE_SUB(NOW(), INTERVAL 25 DAY), 'Confirmed', 34.75, 'johndoe');

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
(5, '978-0393355673', 1);

-- =====================================================
-- 10. Sample Actions (audit log) - 20 entries
-- =====================================================
INSERT INTO action (Username, ISBN, UpdateTimestamp, Notes) VALUES
('admin', '978-1501142970', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial book setup'),
('admin', '978-0439708180', DATE_SUB(NOW(), INTERVAL 28 DAY), 'Updated stock quantity'),
('admin', '978-0385504201', DATE_SUB(NOW(), INTERVAL 25 DAY), 'Price adjustment'),
('admin', '978-0316017930', DATE_SUB(NOW(), INTERVAL 22 DAY), 'Category update'),
('admin', '978-0062316110', DATE_SUB(NOW(), INTERVAL 20 DAY), 'Threshold modified'),
('admin', '978-1524763138', DATE_SUB(NOW(), INTERVAL 18 DAY), 'Added new book to catalog'),
('admin', '978-0735211292', DATE_SUB(NOW(), INTERVAL 15 DAY), 'Stock replenishment'),
('admin', '978-0345539434', DATE_SUB(NOW(), INTERVAL 12 DAY), 'Publisher information updated'),
('admin', '978-0393355673', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Author details corrected'),
('admin', '978-0767908184', DATE_SUB(NOW(), INTERVAL 8 DAY), 'Price reduction for sale'),
('admin', '978-0000000011', DATE_SUB(NOW(), INTERVAL 7 DAY), 'New arrival added'),
('admin', '978-0000000012', DATE_SUB(NOW(), INTERVAL 6 DAY), 'Category reassignment'),
('admin', '978-0000000013', DATE_SUB(NOW(), INTERVAL 5 DAY), 'Stock count verified'),
('admin', '978-0000000014', DATE_SUB(NOW(), INTERVAL 4 DAY), 'Description updated'),
('admin', '978-0000000015', DATE_SUB(NOW(), INTERVAL 3 DAY), 'Threshold increased'),
('admin', '978-0000000016', DATE_SUB(NOW(), INTERVAL 2 DAY), 'Price increase'),
('admin', '978-0000000017', DATE_SUB(NOW(), INTERVAL 1 DAY), 'Featured book selection'),
('admin', '978-0000000018', NOW(), 'Inventory audit completed'),
('admin', '978-0000000019', NOW(), 'Quality check passed'),
('admin', '978-0000000020', NOW(), 'Restocked from warehouse');

-- =====================================================
-- 11. Sample Supply Orders (Reorders) - Confirmed and Cancelled
-- =====================================================
INSERT INTO SupplyOrder (Username, PublisherID, OrderDate, Status, TotalPrice, DecisionBy) VALUES
('admin', 1, DATE_SUB(NOW(), INTERVAL 25 DAY), 'Confirmed', 250.00, 'admin'),
('admin', 2, DATE_SUB(NOW(), INTERVAL 22 DAY), 'Confirmed', 180.50, 'admin'),
('admin', 3, DATE_SUB(NOW(), INTERVAL 20 DAY), 'Cancelled', 320.00, 'admin'),
('admin', 4, DATE_SUB(NOW(), INTERVAL 18 DAY), 'Confirmed', 145.75, 'admin'),
('admin', 5, DATE_SUB(NOW(), INTERVAL 15 DAY), 'Confirmed', 290.00, 'admin'),
('admin', 6, DATE_SUB(NOW(), INTERVAL 12 DAY), 'Cancelled', 175.25, 'admin'),
('admin', 7, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Confirmed', 420.00, 'admin'),
('admin', 8, DATE_SUB(NOW(), INTERVAL 8 DAY), 'Confirmed', 95.50, 'admin'),
('admin', 9, DATE_SUB(NOW(), INTERVAL 5 DAY), 'Confirmed', 310.00, 'admin'),
('admin', 10, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Pending', 225.75, NULL);

-- =====================================================
-- 12. Sample Supply Order Items
-- =====================================================
INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 1, DATE_SUB(NOW(), INTERVAL 25 DAY), '978-1501142970', 20;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 2, DATE_SUB(NOW(), INTERVAL 22 DAY), '978-0439708180', 30;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 3, DATE_SUB(NOW(), INTERVAL 20 DAY), '978-0385504201', 25;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 4, DATE_SUB(NOW(), INTERVAL 18 DAY), '978-0316017930', 15;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 5, DATE_SUB(NOW(), INTERVAL 15 DAY), '978-0062316110', 20;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 6, DATE_SUB(NOW(), INTERVAL 12 DAY), '978-1524763138', 18;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 7, DATE_SUB(NOW(), INTERVAL 10 DAY), '978-0735211292', 35;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 8, DATE_SUB(NOW(), INTERVAL 8 DAY), '978-0345539434', 10;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 9, DATE_SUB(NOW(), INTERVAL 5 DAY), '978-0393355673', 22;

INSERT INTO SupplyOrderItem (Username, PublisherID, OrderDate, ISBN, Quantity)
SELECT 'admin', 10, DATE_SUB(NOW(), INTERVAL 3 DAY), '978-0767908184', 15;
SET FOREIGN_KEY_CHECKS = 1;