#schema 
from pydantic import BaseModel, Field
from typing import Literal

class PatientData(BaseModel):
    age: Literal[
        "10-19","20-29","30-39","40-49","50-59",
        "60-69","70-79","80-89","90-99"
    ]

    menopause: Literal["lt40", "ge40", "premeno"]

    tumor_size: Literal[
        "0-4","5-9","10-14","15-19","20-24",
        "25-29","30-34","35-39","40-44",
        "45-49","50-54","55-59"
    ]

    inv_nodes: Literal[
        "0-2","3-5","6-8","9-11","12-14",
        "15-17","18-20","21-23","24-26",
        "27-29","30-32","33-35","36-39"
    ]

    node_caps: Literal["yes", "no"]

    deg_malig: Literal["1", "2", "3"]

    breast: Literal["left", "right"]

    breast_quad: Literal[
        "left_up","left_low","right_up",
        "right_low","central"
    ]

    irradiat: Literal["yes", "no"]