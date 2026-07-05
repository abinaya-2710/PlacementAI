"""models/__init__.py — Import every model so db.create_all() sees all tables."""

from models.user       import User                                          # noqa: F401
from models.roadmap    import Roadmap, Topic, UserTopicProgress             # noqa: F401
from models.progress   import UserActivity, UserStreak                      # noqa: F401
from models.practice   import Problem, ProblemSolved, ProblemBookmark       # noqa: F401
from models.aptitude   import AptitudeQuestion, AptitudeAttempt             # noqa: F401
from models.company    import Company                                        # noqa: F401
from models.interview  import InterviewQuestion, InterviewBookmark, InterviewExperience  # noqa: F401
from models.resume     import Resume                                         # noqa: F401
from models.profile    import UserProfile                                    # noqa: F401
from models.notification import Notification                                 # noqa: F401
from models.community  import Post, Comment, PostLike                       # noqa: F401
from models.resource   import Resource, ResourceBookmark                    # noqa: F401

__all__ = [
    "User",
    "Roadmap", "Topic", "UserTopicProgress",
    "UserActivity", "UserStreak",
    "Problem", "ProblemSolved", "ProblemBookmark",
    "AptitudeQuestion", "AptitudeAttempt",
    "Company",
    "InterviewQuestion", "InterviewBookmark", "InterviewExperience",
    "Resume",
    "UserProfile",
    "Notification",
    "Post", "Comment", "PostLike",
    "Resource", "ResourceBookmark",
]
