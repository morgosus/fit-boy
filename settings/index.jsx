function fitboySettings(props) {
  return (
    <Page>
      <Text bold align="center">Fit-Boy</Text>
      <Section
        title={<Text bold>Theme</Text>}>
        
        <ColorSelect
          label="Text Color"
          settingsKey="color"
          colors={[
            {color: "#16FF42"},
            {color: "#FFB641"},
            {color: "#1AFF80"},
            {color: "#ffffff"},
            {color: "#FEEED4"},
            {color: "#BE020D"},
            {color: "#EC6173"},
            {color: "#FF8C00"},
            {color: "#E1DD6E"},
            {color: "#FEF265"},
            {color: "#51A350"},
            {color: "#6964FF"},
            {color: "#82A7D6"},
            {color: "#760089"},
            {color: "#BD63BE"}          
          ]}
        />
        
        <Toggle
          settingsKey="cursor"
          label="Stop Console Flash Animation"
          />
        
        <Slider
          settingsKey="bgop"
          min="0"
          max="100"
          label="Background Opacity"
          />
      </Section>
      <Section
        title={<Text bold>Dweller</Text>}>
        
        <TextInput
          settingsKey="name"
          label="Name"
          />
      </Section>
    </Page>
  );
}

registerSettingsPage(fitboySettings);
