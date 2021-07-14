function fitboySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Fitboy Settings</Text>}>
        
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "#16FF42"},
            {color: "#FFB641"},
            {color: "#1AFF80"}
          ]}
        />
        
        <TextInput
          settingsKey="name"
          label="Name"
          />
      </Section>
    </Page>
  );
}

registerSettingsPage(fitboySettings);
