import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from "react";
import "./App.scss";
import { Warrior } from "./Warrior";

function App() {
  const [warrior, setWarrior] = useState<Warrior | undefined>();
  const [nameInputValue, setNameInput] = useState("");
  const [enemyLvl, setEnemyLvl] = useState<number | string>("");
  const [trainInputs, setTrainInputs] = useState<{
    achievement: string;
    rewardExp: number | string;
    minLvl: number | string;
  }>({
    achievement: "",
    rewardExp: "",
    minLvl: "",
  });

  if (!warrior && localStorage.getItem("warrior")) {
    setWarrior(new Warrior(JSON.parse(localStorage.getItem("warrior")!)));
  }

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWarrior(new Warrior({ nm: nameInputValue }));
  };

  const onTrainInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const { name, value } = event.target as HTMLInputElement;
    setTrainInputs((prev) => ({ ...prev, [name]: value }));
  };

  const onKeyDownSpaceHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === " ") event.preventDefault();
    const { name, value } = event.target as HTMLInputElement;
    setTrainInputs((prev) => ({ ...prev, [name]: value + " " }));
  };

  useEffect(() => {
    warrior?.checklvl();
    warrior && localStorage.setItem("warrior", JSON.stringify(warrior));
  }, [warrior]);

  return (
    <div className={`gameWrapper ${!warrior && "createNew"}`}>
      <div className="createCaracter">
        <form onSubmit={onSubmitHandler}>
          <h1>Создайте персонажа</h1>
          <input
            type="text"
            placeholder="Введите имя"
            value={nameInputValue}
            onChange={(ev) => setNameInput(ev.target.value)}
          />
          <button disabled={!nameInputValue}>Создать</button>
        </form>
      </div>
      <div className="game">
        <header>
          <span className="name">
            Имя: <span>{warrior?.name()}</span>
          </span>
          <div className="stats">
            lvl: <span>{warrior?.level()}</span>
            exp: <span>{warrior?.experience()}</span>
          </div>
        </header>

        <div className="caracter">
          <img src="/warrior.gif" alt="" className="warrior-image" />
          <div className="achievementStats">
            <span>Ранг: {warrior?.rank()}</span>
            <div className="achievements">
              <span>Достижения:</span>
              <div className="array">
                {warrior?.achievements().map((ach, i) => (
                  <span key={i}>{ach}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button
            className="fight"
            onClick={() => {
              setWarrior((prev) => {
                const warrior = new Warrior({
                  nm: prev?.name()!,
                  lvl: prev?.level()!,
                  exp: prev?.experience()!,
                  ach: prev?.achievements()!,
                });
                alert(warrior.battle(+enemyLvl));
                return warrior;
              });
            }}
          >
            Бой:{" "}
            <input
              name="enemyLvl"
              type="number"
              placeholder="lvl противника"
              onClick={(ev) => ev.stopPropagation()}
              onChange={(ev) => setEnemyLvl(ev.target.value)}
              inputMode="numeric"
              enterKeyHint="done"
            />
          </button>

          <button
            className="training"
            onClick={() => {
              setWarrior((prev) => {
                const warrior = new Warrior({
                  nm: prev?.name()!,
                  lvl: prev?.level()!,
                  exp: prev?.experience()!,
                  ach: prev?.achievements()!,
                });
                alert(
                  warrior.training([
                    trainInputs.achievement,
                    +trainInputs.rewardExp,
                    +trainInputs.minLvl,
                  ])
                );
                return warrior;
              });
            }}
          >
            Тренировка
            <input
              type="text"
              name="achievement"
              placeholder="Достижение"
              value={trainInputs.achievement}
              onKeyDown={onKeyDownSpaceHandler}
              onClick={(ev) => ev.stopPropagation()}
              onInput={onTrainInputHandler}
            />
            <input
              type="number"
              name="rewardExp"
              inputMode="numeric"
              value={trainInputs.rewardExp}
              onKeyDown={onKeyDownSpaceHandler}
              onClick={(ev) => ev.stopPropagation()}
              onChange={onTrainInputHandler}
              placeholder="Опыт в награду"
            />
            <input
              type="number"
              name="minLvl"
              inputMode="numeric"
              value={trainInputs.minLvl}
              onKeyDown={onKeyDownSpaceHandler}
              onClick={(ev) => ev.stopPropagation()}
              onChange={onTrainInputHandler}
              placeholder="Минимальный lvl"
            />
          </button>
        </div>
        <footer>
          <button
            className="exit"
            onClick={() => {
              if (window.confirm("Весь прогресс персонажа удалиться, вы уверены?")) {
                localStorage.removeItem("warrior");
                setWarrior(undefined);
              }
            }}
          >
            Завершить приключение
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
