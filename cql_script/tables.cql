CREATE KEYSPACE SuperAI WITH  replication = {'class':'SimpleStrategy', 'replication_factor':1};
-- immuable table
CREATE TABLE UserChats (
  user_id uuid,
  chat_id uuid,
  joined_at timestamp,
  PRIMARY KEY ((user_id), chat_id) 
);

CREATE TABLE SuperAI.UserMessages (
   user_message_id uuid,
   user_id uuid,
   chat_id uuid,
   content TEXT,
   created_at timestamp,
   updated_at timestamp,
   PRIMARY KEY ((chat_id,user_id),user_message_id)
);

CREATE TABLE SuperAI.LLMMessages (
   llm_message_id uuid,
   category_id uuid,
   user_id uuid,
   category_name TEXT,
   chat_id uuid,
   content TEXT,
   created_at timestamp,
   updated_at timestamp,
   PRIMARY KEY ((chat_id,user_id),llm_message_id)
);

CREATE TABLE SuperAI.Categories (
   category_id uuid,
   category_name TEXT,
   created_at timestamp,
   updated_at timestamp,
   PRIMARY KEY (category_id)
);

CREATE TABLE SuperAI.qa_pairs (
   qa_pair_id uuid,
   question uuid,
   answer uuid,
   category_id uuid,
   category_name TEXT,
   created_at timestamp,
   updated_at timestamp,
  PRIMARY KEY ((category_id), qa_pair_id)
);