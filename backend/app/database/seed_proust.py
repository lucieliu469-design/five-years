from app.database.db import SessionLocal
from app.models.proust import ProustQuestion

PROUST_QUESTIONS = [
    "What is your idea of perfect happiness?",
    "What is your greatest fear?",
    "What is the trait you most deplore in yourself?",
    "What is the trait you most deplore in others?",
    "Which living person do you most admire?",
    "What is your greatest extravagance?",
    "What is your current state of mind?",
    "What do you consider the most overrated virtue?",
    "On what occasion do you lie?",
    "What do you most dislike about your appearance?",
    "Which living person do you most despise?",
    "What is the quality you most like in a man?",
    "What is the quality you most like in a woman?",
    "Which words or phrases do you most overuse?",
    "What or who is the greatest love of your life?",
    "When and where were you happiest?",
    "Which talent would you most like to have?",
    "If you could change one thing about yourself, what would it be?",
    "What do you consider your greatest achievement?",
    "If you were to die and come back as a person or a thing, what would it be?",
    "Where would you most like to live?",
    "What is your most treasured possession?",
    "What do you regard as the lowest depth of misery?",
    "What is your favorite occupation?",
    "What is your most marked characteristic?",
    "What do you most value in your friends?",
    "Who are your favorite writers?",
    "Who is your hero of fiction?",
    "Which historical figure do you most identify with?",
    "Who are your heroes in real life?",
    "What are your favorite names?",
    "What is it that you most dislike?",
    "What is your greatest regret?",
    "How would you like to die?",
    "What is your motto?",
]

TRANSLATIONS = [
    "你心中完美的幸福是什么？",
    "你最大的恐惧是什么？",
    "你最痛恨自己的哪一个特点？",
    "你最痛恨他人的哪一个特点？",
    "你最敬佩的在世人物是谁？",
    "你最大的奢侈是什么？",
    "你目前的心境如何？",
    "你认为最被高估的美德是什么？",
    "你在什么场合会撒谎？",
    "你最不喜欢自己的外表哪一点？",
    "你最鄙视的在世人物是谁？",
    "你最喜欢男性身上的什么品质？",
    "你最喜欢女性身上的什么品质？",
    "你最常使用哪些词语或短语？",
    "你一生中最爱的人或事物是什么？",
    "你何时何地最快乐？",
    "你最想拥有哪种天赋？",
    "如果你能改变自己的一件事，那会是什么？",
    "你认为你最大的成就是什么？",
    "如果你死后能以人或物的形态重生，那会是什么？",
    "你最想住在哪里？",
    "你最珍贵的财产是什么？",
    "你认为最深重的苦难是什么？",
    "你最喜欢的职业是什么？",
    "你最显著的特点是什么？",
    "你最看重朋友的什么品质？",
    "你最喜欢的作家是谁？",
    "你虚构中的英雄是谁？",
    "你最认同哪位历史人物？",
    "你现实生活中的英雄是谁？",
    "你最喜欢的名字是什么？",
    "你最厌恶的是什么？",
    "你最大的遗憾是什么？",
    "你希望如何死去？",
    "你的座右铭是什么？",
]


def seed_proust_questions():
    db = SessionLocal()
    try:
        existing = db.query(ProustQuestion).count()
        if existing > 0:
            return
        for i, (en, cn) in enumerate(zip(PROUST_QUESTIONS, TRANSLATIONS)):
            q = ProustQuestion(question_en=en, question_cn=cn, order_index=i + 1)
            db.add(q)
        db.commit()
    finally:
        db.close()
