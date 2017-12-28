from hmk.api.models import db

subs = db.Table('subs',
                db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
                db.Column('channel_id', db.Integer, db.ForeignKey('channel.id'))
                )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    subscriptions = db.relationship('Channel', secondary=subs, backref=db.backref('subscribers', lazy='dynamic'))


class Channel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
